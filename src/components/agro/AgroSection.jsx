import { useRef, useState, useCallback } from 'react';
import { Upload, Loader } from 'lucide-react';
import { analyzeTree } from '../../services/api';
import { useWeatherContext } from '../../context/useWeatherContext';
import AgroResults from './AgroResults';
import AgroQuota from './AgroQuota';

export default function AgroSection() {
  const { toast } = useWeatherContext();
  const fileInputRef  = useRef(null);
  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fields, setFields]     = useState({ farmerId: '', county: '', landAcres: '', notes: '' });
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) {
      toast('Please upload a JPEG, PNG, or WEBP image.', 'warning'); return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast('Image must be under 20 MB.', 'warning'); return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const { data } = await analyzeTree({ image, ...fields, landAcres: fields.landAcres || undefined });
      setResult(data);
      toast('Analysis complete ✓', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-20">
      {/* Section header */}
      <div className="mb-8">
        <p className="eyebrow mb-3">Agroforestry Intelligence</p>
        <h2 className="text-[clamp(26px,4vw,40px)] font-black tracking-[-0.04em] text-white mb-3">
          Tree &amp; Farm Analysis
        </h2>
        <p className="text-wtext2 text-[14px] max-w-[560px] leading-relaxed">
          Upload a drone, aerial, or satellite image to get AI-powered tree counting,
          canopy health scoring, and agronomic recommendations — powered by OpenCV + Gemini.
        </p>
      </div>

      {/* Quota bar */}
      <div className="mb-4"><AgroQuota /></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Upload panel */}
        <div className="glass overflow-hidden">
          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`relative min-h-[200px] flex items-center justify-center cursor-pointer transition-all border-b border-white/[0.06]
              ${dragging ? 'bg-accent/5 border-accent/30' : 'bg-bg4 hover:bg-bg4/80'}`}
          >
            <input ref={fileInputRef} type="file" hidden accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFile(e.target.files[0])} />

            {preview ? (
              <img src={preview} alt="Farm preview" className="w-full h-[200px] object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-bg3 border border-white/10 flex items-center justify-center text-[28px]">
                  🛰️
                </div>
                <p className="text-wtext2 text-[14px]">
                  Drop a farm image here or{' '}
                  <span className="text-accent font-semibold">browse</span>
                </p>
                <p className="font-mono text-[11px] text-muted">JPEG · PNG · WEBP · max 20 MB</p>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="p-5 flex flex-col gap-3">
            {[
              { key: 'farmerId',  label: 'Farmer ID',         placeholder: 'F-001 (optional)' },
              { key: 'county',    label: 'County / Region',   placeholder: 'e.g. Bomet' },
              { key: 'landAcres', label: 'Land Area (acres)', placeholder: '2.5', type: 'number' },
              { key: 'notes',     label: 'Notes',             placeholder: 'Tea plantation, recently pruned…' },
            ].map(({ key, label, placeholder, type = 'text' }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-muted tracking-wider uppercase">{label}</label>
                <input
                  type={type}
                  value={fields[key]}
                  onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="wai-input w-full"
                />
              </div>
            ))}

            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="mt-2 w-full bg-accent text-bg font-bold text-[14px] py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-85 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader size={16} className="animate-spin-slow" /> Analyzing…</>
              ) : (
                <><Upload size={15} /> Analyze Farm</>
              )}
            </button>
          </div>
        </div>

        {/* Results panel */}
        {result ? (
          <AgroResults data={result} />
        ) : (
          <div className="glass flex flex-col items-center justify-center gap-4 text-center py-16 px-8">
            <span className="text-[56px] opacity-30">🌳</span>
            <p className="text-muted text-[14px] max-w-[260px] leading-relaxed">
              Upload a farm image and click <strong className="text-wtext2">Analyze Farm</strong> to see AI-powered tree insights.
            </p>
            <div className="flex gap-3 mt-2">
              {['5 / mo Free', '100 / mo Pro', 'Unlimited Scale'].map((t, i) => (
                <span key={i} className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                  i === 0 ? 'plan-badge-free' : i === 1 ? 'plan-badge-pro' : 'plan-badge-scale'
                }`}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
