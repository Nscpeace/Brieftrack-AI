import React, { useState } from 'react';
import { TranscriptPreset, ExtractedActionItem, DecisionLogItem } from '../types';
import { TRANSCRIPT_PRESETS } from '../data/mockData';
import {
  Mic,
  FileText,
  Upload,
  Play,
  Sparkles,
  CheckCircle,
  FileCheck2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface TranscriptLabProps {
  onProcessTranscript: (
    transcript: string,
    meetingTitle: string,
    clientName: string
  ) => Promise<{
    summary: string;
    sentiment: string;
    keyDecisions: DecisionLogItem[];
    actionItems: ExtractedActionItem[];
  }>;
  onSendToStaging: (actions: ExtractedActionItem[]) => void;
  isProcessing?: boolean;
}

export const TranscriptLab: React.FC<TranscriptLabProps> = ({
  onProcessTranscript,
  onSendToStaging,
  isProcessing = false,
}) => {
  const [ingestMode, setIngestMode] = useState<'preset' | 'paste' | 'upload'>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(TRANSCRIPT_PRESETS[0].id);
  const [pastedText, setPastedText] = useState<string>('');
  const [meetingTitleInput, setMeetingTitleInput] = useState<string>('Apex Health Systems — Q4 SLA & Renewal Discussion');
  const [clientNameInput, setClientNameInput] = useState<string>('Apex Health Systems');
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);

  // Result state
  const [result, setResult] = useState<{
    summary: string;
    sentiment: string;
    keyDecisions: DecisionLogItem[];
    actionItems: ExtractedActionItem[];
  } | null>(null);

  const selectedPreset = TRANSCRIPT_PRESETS.find((p) => p.id === selectedPresetId) || TRANSCRIPT_PRESETS[0];

  const handlePresetSelect = (preset: TranscriptPreset) => {
    setSelectedPresetId(preset.id);
    setMeetingTitleInput(preset.title);
    setClientNameInput(preset.clientName);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPastedText(content);
      if (!meetingTitleInput || meetingTitleInput.includes('Preset')) {
        setMeetingTitleInput(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  const handleExecute = async () => {
    let transcriptToProcess = '';
    if (ingestMode === 'preset') {
      transcriptToProcess = selectedPreset.fullTranscript;
    } else {
      transcriptToProcess = pastedText;
    }

    if (!transcriptToProcess.trim()) return;

    try {
      const res = await onProcessTranscript(
        transcriptToProcess,
        meetingTitleInput || 'Client Adjourned Meeting',
        clientNameInput || 'Client Account'
      );
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedToConfirmation = () => {
    if (!result) return;
    onSendToStaging(result.actionItems);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Transcript Processing & Intelligence Lab
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ingest post-meeting call recordings to extract executive summaries, strategic decisions, and actionable deliverables.
          </p>
        </div>

        {result && (
          <button
            onClick={() => setResult(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Process Another Transcript</span>
          </button>
        )}
      </div>

      {!result ? (
        <div className="space-y-5">
          {/* Ingestion Mode Segmented Switcher */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                1. Select Transcript Ingestion Source
              </span>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setIngestMode('preset')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    ingestMode === 'preset' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Realistic Client Presets
                </button>
                <button
                  onClick={() => setIngestMode('paste')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    ingestMode === 'paste' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Paste Raw Transcript
                </button>
                <button
                  onClick={() => setIngestMode('upload')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    ingestMode === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload File (.txt, .vtt)
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            {ingestMode === 'preset' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {TRANSCRIPT_PRESETS.map((preset) => {
                  const isSelected = preset.id === selectedPresetId;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-[11px] font-semibold text-blue-700">{preset.clientName}</div>
                      <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{preset.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{preset.meetingType}</div>
                      <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 italic bg-white/70 p-2 rounded border border-slate-100">
                        "{preset.snippet}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Paste Raw Transcript Mode */}
            {ingestMode === 'paste' && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Meeting Subject / Title
                    </label>
                    <input
                      type="text"
                      value={meetingTitleInput}
                      onChange={(e) => setMeetingTitleInput(e.target.value)}
                      placeholder="e.g. Q4 Client Governance Checkpoint"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Client Account Name
                    </label>
                    <input
                      type="text"
                      value={clientNameInput}
                      onChange={(e) => setClientNameInput(e.target.value)}
                      placeholder="e.g. Acme Global Logistics"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
                    <span>Meeting Transcript Body</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {pastedText.length} characters
                    </span>
                  </label>
                  <textarea
                    rows={8}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste full call transcript or timestamped dialogue here..."
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Upload File Mode */}
            {ingestMode === 'upload' && (
              <div className="space-y-3 pt-2">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-800">
                    {uploadFileName ? `Loaded: ${uploadFileName}` : 'Select a transcript file from your computer'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports .txt, .vtt, .srt, .md transcripts (Zoom, Google Meet, Teams, Otter.ai)
                  </p>
                  <label className="mt-3 inline-block px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      accept=".txt,.vtt,.srt,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {pastedText && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      File Preview ({pastedText.length} characters)
                    </label>
                    <textarea
                      readOnly
                      rows={5}
                      value={pastedText}
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Run Extraction Trigger */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Transcripts processed via server-side Gemini 3.8 Flash model.</span>
              </div>

              <button
                onClick={handleExecute}
                disabled={isProcessing || (ingestMode !== 'preset' && !pastedText.trim())}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Extracting Takeaways & Actions...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run AI Transcript Extraction</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Processing Results Display */
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-blue-700">{clientNameInput}</span>
              <span className="font-medium text-slate-600 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Sentiment: <strong className="text-slate-800">{result.sentiment}</strong>
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              Meeting Executive Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Strategic Decisions Agreed */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Key Strategic Decisions Agreed ({result.keyDecisions.length})</span>
            </h2>

            <div className="divide-y divide-slate-100">
              {result.keyDecisions.map((dec, idx) => (
                <div key={dec.id || idx} className="py-3 first:pt-0 last:pb-0 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{dec.topic}</span>
                    <span className="text-slate-500 font-medium">Owner: {dec.owner}</span>
                  </div>
                  <p className="text-slate-800 font-medium">
                    Decision: {dec.decision}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Rationale: {dec.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Action Items Callout & Gate Trigger */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Extracted Deliverables & Actions ({result.actionItems.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extracted with owner suggestions and due dates. Ready for safety confirmation before pushing to task tools.
                </p>
              </div>

              <button
                onClick={handleProceedToConfirmation}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <span>Proceed to Human Confirmation Gate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scannable Actions Preview */}
            <div className="space-y-2.5 pt-2">
              {result.actionItems.map((act, idx) => (
                <div
                  key={act.id || idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-slate-900 leading-snug">
                      {act.title}
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded uppercase tracking-wider shrink-0 bg-white border border-slate-200 text-slate-600">
                      {act.priority} priority
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {act.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                    <span>Assignee: <strong className="text-slate-700">{act.assignee}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Due: {act.dueDate}</span>
                    {act.confidence && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-emerald-700">
                          {Math.round(act.confidence * 100)}% AI confidence
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
