import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, X, Check, Pencil, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ProofOfDelivery() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  
  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Signature canvas handlers
  const getCanvasPoint = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };
  
  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    if (point) {
      lastPointRef.current = point;
    }
  };
  
  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const point = getCanvasPoint(e);
    
    if (ctx && point && lastPointRef.current) {
      ctx.beginPath();
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      lastPointRef.current = point;
      
      // Mark signature as captured
      setSignature('captured');
    }
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };
  
  const handleSubmit = async () => {
    if (!photo && !signature) {
      toast({
        title: 'Preuve requise',
        description: 'Veuillez prendre une photo ou recueillir une signature',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: 'Livraison confirmée',
      description: 'La preuve de livraison a été enregistrée',
    });
    
    navigate('/orders');
  };
  
  const canSubmit = photo || signature;
  
  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-top">
        <div className="flex items-center gap-4 h-14 px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Preuve de livraison</h1>
        </div>
      </header>
      
      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* Instructions */}
        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground">
            Prenez une photo du colis et/ou recueillez la signature du destinataire
          </p>
        </div>
        
        {/* Photo Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Photo du colis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />
            
            {photo ? (
              <div className="relative">
                <img
                  src={photo}
                  alt="Photo du colis"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon-sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePhoto}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Photo ajoutée
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full h-32 border-dashed border-2"
                onClick={handleTakePhoto}
              >
                <div className="flex flex-col items-center gap-2">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="text-muted-foreground">Prendre une photo</span>
                </div>
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Signature Section */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Pencil className="w-5 h-5" />
                Signature
              </CardTitle>
              {signature && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSignature}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "relative rounded-lg border-2 border-dashed overflow-hidden",
              signature ? "border-success bg-success/5" : "border-border bg-muted/50"
            )}>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full h-40 touch-none cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              
              {!signature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-muted-foreground text-sm">
                    Signez ici avec votre doigt
                  </p>
                </div>
              )}
              
              {signature && (
                <div className="absolute bottom-2 left-2 bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Signature ajoutée
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Submit Button */}
        <div className="pt-4">
          <Button
            size="xl"
            className="w-full"
            onClick={handleSubmit}
            disabled={!canSubmit || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Confirmer la livraison
              </>
            )}
          </Button>
          
          {!canSubmit && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              Ajoutez une photo ou une signature pour continuer
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
