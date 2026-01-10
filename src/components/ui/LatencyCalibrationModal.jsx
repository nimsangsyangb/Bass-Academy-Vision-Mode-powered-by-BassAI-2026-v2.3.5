/**
 * LatencyCalibrationModal.jsx
 * Modal for calibrating audio latency via tap-to-click
 */
import React from 'react';
import { X, Volume2, Check, RotateCcw, AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { LATENCY_CONFIG } from '../../config/audioConfig.js';

const LatencyCalibrationModal = ({
  isOpen,
  onClose,
  isCalibrating,
  isComplete,
  currentClick,
  totalClicks,
  calculatedOffset,
  latencyOffsetMs,
  onStartCalibration,
  onRecordTap,
  onApplyCalibration,
  onCancelCalibration,
  onResetLatency,
}) => {
  if (!isOpen) return null;

  const progress = (currentClick / totalClicks) * 100;

  // Evaluate calibration quality
  const getCalibrationQuality = () => {
    if (calculatedOffset === null) return null;
    
    const absOffset = Math.abs(calculatedOffset);
    
    if (absOffset <= 50) {
      return {
        level: 'excellent',
        icon: Sparkles,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        title: '¡Excelente!',
        message: 'Tu dispositivo tiene muy baja latencia. Calibración óptima.',
      };
    } else if (absOffset <= 100) {
      return {
        level: 'good',
        icon: Check,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        title: 'Calibración Correcta',
        message: 'Latencia normal para dispositivos móviles.',
      };
    } else {
      return {
        level: 'warning',
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        title: 'Latencia Alta Detectada',
        message: 'Tu dispositivo tiene latencia elevada. Considera usar auriculares con cable.',
      };
    }
  };

  const quality = getCalibrationQuality();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-strong rounded-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-primary-medium)]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-[var(--color-primary-deep)]" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--color-cream)]">Calibración de Latencia</h2>
              <p className="text-xs text-[var(--color-primary-light)]">
                Offset actual: <span className="text-[var(--color-gold)]">{latencyOffsetMs}ms</span>
              </p>
            </div>
          </div>
          <button
            onClick={isCalibrating ? onCancelCalibration : onClose}
            className="p-2 rounded-full hover:bg-[var(--color-primary-medium)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-primary-light)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Idle State - Instructions */}
          {!isCalibrating && !isComplete && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--color-primary-dark)]/50 border border-[var(--color-primary-medium)]/30">
                <h3 className="font-semibold text-[var(--color-cream)] mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[var(--color-gold)]" />
                  Instrucciones
                </h3>
                <ol className="text-sm text-[var(--color-primary-light)] space-y-2 list-decimal list-inside">
                  <li>Presiona "Iniciar Calibración"</li>
                  <li>Escucharás una serie de clics</li>
                  <li>Toca el botón grande <strong>cuando escuches</strong> cada clic</li>
                  <li>La app calculará la latencia de tu dispositivo</li>
                </ol>
              </div>

              <button
                onClick={onStartCalibration}
                className="w-full py-4 rounded-xl gradient-gold text-[var(--color-primary-deep)] font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] btn-press"
              >
                Iniciar Calibración
              </button>

              {latencyOffsetMs !== 0 && (
                <button
                  onClick={onResetLatency}
                  className="w-full py-3 rounded-xl bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-primary-medium)] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restablecer a 0ms
                </button>
              )}
            </div>
          )}

          {/* Calibrating State */}
          {isCalibrating && (
            <div className="space-y-6">
              {/* Progress */}
              <div className="text-center">
                <p className="text-[var(--color-primary-light)] mb-2">
                  Toque {currentClick} de {totalClicks}
                </p>
                <div className="h-2 bg-[var(--color-primary-dark)] rounded-full overflow-hidden">
                  <div 
                    className="h-full gradient-gold transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Tap Button */}
              <button
                onClick={onRecordTap}
                className="w-full aspect-square max-w-[200px] mx-auto rounded-full gradient-gold flex items-center justify-center text-[var(--color-primary-deep)] font-bold text-xl shadow-lg transition-all hover:scale-105 active:scale-95 animate-pulse btn-press"
              >
                ¡TAP!
              </button>

              <p className="text-center text-sm text-[var(--color-primary-light)]">
                Toca cuando escuches el clic
              </p>

              <button
                onClick={onCancelCalibration}
                className="w-full py-3 rounded-xl bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] font-medium hover:bg-[var(--color-primary-medium)] transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Complete State */}
          {isComplete && quality && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${quality.bgColor} flex items-center justify-center`}>
                  <quality.icon className={`w-8 h-8 ${quality.color}`} />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-cream)] mb-2">
                  {quality.title}
                </h3>
                <p className="text-[var(--color-primary-light)]">
                  Latencia detectada:
                </p>
                <p className="text-3xl font-bold text-[var(--color-gold)] mt-2">
                  {calculatedOffset}ms
                </p>
                <p className={`text-sm mt-3 ${quality.color}`}>
                  {quality.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onCancelCalibration}
                  className="py-3 rounded-xl bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] font-medium hover:bg-[var(--color-primary-medium)] transition-colors"
                >
                  Descartar
                </button>
                <button
                  onClick={() => {
                    onApplyCalibration();
                    onClose();
                  }}
                  className="py-3 rounded-xl gradient-gold text-[var(--color-primary-deep)] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all btn-press"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 pb-4">
          <p className="text-xs text-center text-[var(--color-primary-light)]/60">
            La calibración compensa la latencia de audio de tu dispositivo para mejorar la precisión del feedback.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LatencyCalibrationModal;
