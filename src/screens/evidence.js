import { navigate, setCurrentClaim, setCurrentClaimStatus, state, updateDraftClaim } from '../main.js';
import { analyzeClaim, createClaim, uploadEvidence } from '../services/api_service.js';

const submitLabels = {
  idle: 'Analyze with AURA AI',
  uploading: 'Uploading evidence...',
  creating: 'Creating claim record...',
  starting: 'Starting backend analysis...'
};

function getFilePreviewName(file) {
  return `${file.name} - ${Math.max(1, Math.round(file.size / 1024))} KB`;
}

export function renderEvidence() {
  const container = document.createElement('div');
  container.className = 'w-full max-w-md mx-auto flex flex-col gap-8 pb-4';
  const draft = state.draftClaim;

  container.innerHTML = `
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 class="font-headline-md text-headline-md text-on-surface">Step 1 of 3</h1>
        <span class="font-label-caps text-label-caps text-secondary uppercase">Evidence Collection</span>
      </div>
      <div class="w-full h-1 bg-surface-variant rounded-full overflow-hidden relative">
        <div class="h-full bg-secondary w-1/3 absolute left-0 top-0 rounded-full shadow-[0_0_10px_rgba(0,110,42,0.3)]"></div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="font-title-sm text-title-sm text-on-surface-variant">Select Claim Type</h2>
      <div class="grid grid-cols-1 gap-3" id="claim-type-grid">
        <button class="claim-btn w-full border rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group transition-all ${draft.claimType === 'product_defect' ? 'bg-secondary/5 border-secondary shadow-sm' : 'bg-surface-container-lowest border-outline-variant hover:border-outline hover:shadow-sm'}" data-claim-type="product_defect">
          <div class="flex min-w-0 items-center gap-3 relative z-10">
            <div class="icon-bg w-10 h-10 rounded-full flex items-center justify-center border ${draft.claimType === 'product_defect' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/30'}">
              <span class="material-symbols-outlined" data-icon="inventory_2" data-weight="fill" style="font-variation-settings: 'FILL' ${draft.claimType === 'product_defect' ? 1 : 0};">inventory_2</span>
            </div>
            <span class="label-text font-body-md text-body-md ${draft.claimType === 'product_defect' ? 'text-on-surface font-medium' : 'text-on-surface-variant'}">Product Defect</span>
          </div>
          <div class="radio-outer w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 ${draft.claimType === 'product_defect' ? 'border-secondary bg-secondary/10' : 'border-outline-variant'}">
            <div class="radio-inner w-2.5 h-2.5 rounded-full bg-secondary ${draft.claimType === 'product_defect' ? '' : 'hidden'}"></div>
          </div>
        </button>
        <button class="claim-btn w-full border rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group transition-all ${draft.claimType === 'shipping_damage' ? 'bg-secondary/5 border-secondary shadow-sm' : 'bg-surface-container-lowest border-outline-variant hover:border-outline hover:shadow-sm'}" data-claim-type="shipping_damage">
          <div class="flex min-w-0 items-center gap-3 relative z-10">
            <div class="icon-bg w-10 h-10 rounded-full flex items-center justify-center border ${draft.claimType === 'shipping_damage' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/30'}">
              <span class="material-symbols-outlined" data-icon="local_shipping" style="font-variation-settings: 'FILL' ${draft.claimType === 'shipping_damage' ? 1 : 0};">local_shipping</span>
            </div>
            <span class="label-text font-body-md text-body-md ${draft.claimType === 'shipping_damage' ? 'text-on-surface font-medium' : 'text-on-surface-variant'}">Shipping Damage</span>
          </div>
          <div class="radio-outer w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 ${draft.claimType === 'shipping_damage' ? 'border-secondary bg-secondary/10' : 'border-outline-variant'}">
            <div class="radio-inner w-2.5 h-2.5 rounded-full bg-secondary ${draft.claimType === 'shipping_damage' ? '' : 'hidden'}"></div>
          </div>
        </button>
        <button class="claim-btn w-full border rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group transition-all ${draft.claimType === 'missing_item' ? 'bg-secondary/5 border-secondary shadow-sm' : 'bg-surface-container-lowest border-outline-variant hover:border-outline hover:shadow-sm'}" data-claim-type="missing_item">
          <div class="flex min-w-0 items-center gap-3 relative z-10">
            <div class="icon-bg w-10 h-10 rounded-full flex items-center justify-center border ${draft.claimType === 'missing_item' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/30'}">
              <span class="material-symbols-outlined" data-icon="search_off" style="font-variation-settings: 'FILL' ${draft.claimType === 'missing_item' ? 1 : 0};">search_off</span>
            </div>
            <span class="label-text font-body-md text-body-md ${draft.claimType === 'missing_item' ? 'text-on-surface font-medium' : 'text-on-surface-variant'}">Missing Item</span>
          </div>
          <div class="radio-outer w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 ${draft.claimType === 'missing_item' ? 'border-secondary bg-secondary/10' : 'border-outline-variant'}">
            <div class="radio-inner w-2.5 h-2.5 rounded-full bg-secondary ${draft.claimType === 'missing_item' ? '' : 'hidden'}"></div>
          </div>
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-title-sm text-title-sm text-on-surface-variant">Upload Evidence</h2>
        <span class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Required</span>
      </div>
      <input id="evidence-file-input" type="file" class="hidden" accept="image/*,video/*,audio/*" />
      <div id="evidence-dropzone" class="w-full rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-sm cursor-pointer hover:bg-primary/10 transition-colors">
        <div class="w-16 h-16 rounded-full bg-surface/80 backdrop-blur-md border border-primary/20 flex items-center justify-center mb-4 relative z-10 shadow-md">
          <span class="material-symbols-outlined text-primary text-3xl" data-icon="cloud_upload">cloud_upload</span>
          <div class="absolute inset-0 rounded-full border border-primary/30 animate-pulse"></div>
        </div>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">Drop Photo or Video</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant relative z-10 max-w-[220px] mb-4">Select one evidence file for the live demo. Max 500MB, 2 minute duration limit.</p>
        <button id="browse-files-btn" type="button" class="bg-surface border border-outline-variant rounded-full px-6 py-2 font-label-caps text-label-caps text-primary uppercase tracking-wider relative z-10 hover:bg-surface-variant transition-colors shadow-sm">
          ${draft.evidencePreviewName && !draft.evidenceNeedsReselection ? 'Replace File' : 'Browse Files'}
        </button>
      </div>
      <div id="selected-file-card" class="rounded-2xl border border-outline-variant/50 bg-surface-container-low p-4 ${draft.evidencePreviewName ? '' : 'hidden'}">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-label-caps text-label-caps text-primary uppercase tracking-wider">Selected Evidence</p>
            <p id="selected-file-name" class="mt-2 break-words text-body-md text-on-surface">${draft.evidencePreviewName || ''}</p>
            <p id="selected-file-hint" class="mt-1 text-body-sm text-on-surface-variant ${draft.evidenceNeedsReselection ? '' : 'hidden'}">This file was restored from a previous draft. Re-attach it before submitting.</p>
          </div>
          <button id="remove-file-btn" type="button" class="shrink-0 rounded-full border border-outline-variant px-3 py-2 text-body-sm text-on-surface-variant hover:bg-surface">
            Remove
          </button>
        </div>
      </div>
      <p id="file-error" class="hidden text-body-sm text-error"></p>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="font-title-sm text-title-sm text-on-surface-variant">Problem Description</h2>
          <p class="mt-1 text-body-sm text-on-surface-variant">Write short context so reviewer and AI understand issue faster.</p>
        </div>
        <span class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Required</span>
      </div>
      <div class="rounded-2xl border border-outline-variant/50 bg-white/70 p-4 shadow-sm backdrop-blur-md">
        <label class="mb-3 flex items-center gap-2 text-body-sm font-medium text-on-surface" for="claim-description">
          <span class="material-symbols-outlined text-primary text-[18px]">edit_note</span>
          Explain what happened
        </label>
        <textarea id="claim-description" class="min-h-[132px] w-full resize-none rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Example: Screen cracked after package arrived. Box had visible dent on the lower-right corner and device would not turn on after unboxing.">${draft.textDescription}</textarea>
        <div class="mt-3 flex items-start gap-2 text-body-sm text-on-surface-variant">
          <span class="material-symbols-outlined mt-0.5 text-[16px] text-primary/70">lightbulb</span>
          Include timeline, visible damage, and anything unusual during delivery or usage.
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-title-sm text-title-sm text-on-surface-variant">Voice Context (Optional)</h2>
        <span class="material-symbols-outlined text-on-surface-variant text-sm" data-icon="info">info</span>
      </div>
      <textarea id="voice-description" class="min-h-[96px] w-full resize-none rounded-xl border border-outline-variant/50 bg-surface-container px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Optional: record a voice note or paste a short transcript.">${draft.voiceDescription}</textarea>
      <div class="bg-surface-container border border-outline-variant/50 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-sm">
        <div class="flex items-center gap-4">
        <button id="voice-record-btn" class="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm flex-shrink-0 hover:bg-primary/20 transition-colors" type="button" aria-label="Start voice recording">
          <span id="voice-record-icon" class="material-symbols-outlined" data-icon="mic" data-weight="fill" style="font-variation-settings: 'FILL' 1;">mic</span>
        </button>
        <div id="voice-waveform" class="flex-1 h-8 flex items-center gap-1 opacity-60 overflow-hidden">
          <div class="w-1 h-3 bg-primary rounded-full"></div>
          <div class="w-1 h-6 bg-primary rounded-full"></div>
          <div class="w-1 h-4 bg-primary rounded-full"></div>
          <div class="w-1 h-8 bg-primary rounded-full"></div>
          <div class="w-1 h-5 bg-primary rounded-full"></div>
          <div class="w-1 h-2 bg-primary rounded-full"></div>
          <div class="w-1 h-4 bg-primary rounded-full"></div>
          <div class="w-1 h-7 bg-primary rounded-full"></div>
          <div class="w-1 h-3 bg-primary rounded-full"></div>
          <div class="w-1 h-5 bg-primary rounded-full"></div>
          <div class="w-1 h-2 bg-primary rounded-full"></div>
          <div class="w-1 h-4 bg-primary rounded-full"></div>
          <div class="w-1 h-6 bg-primary rounded-full"></div>
          <div class="w-1 h-3 bg-primary rounded-full"></div>
          <div class="w-1 h-5 bg-primary rounded-full"></div>
          <div class="w-1 h-2 bg-primary rounded-full"></div>
          <div class="w-1 h-4 bg-primary rounded-full"></div>
        </div>
        <span id="voice-timer" class="font-label-caps text-label-caps text-on-surface-variant flex-shrink-0">00:00</span>
        </div>
        <audio id="voice-playback" class="hidden w-full" controls></audio>
        <div class="flex items-start justify-between gap-3">
          <p id="voice-status" class="text-body-sm text-on-surface-variant">Tap the mic to record voice context.</p>
          <button id="remove-voice-btn" type="button" class="hidden shrink-0 rounded-full border border-outline-variant px-3 py-1.5 text-body-sm text-on-surface-variant hover:bg-surface">
            Remove
          </button>
        </div>
      </div>
    </div>

    <div class="sticky bottom-4 z-20 mt-2 pb-1">
      <div class="rounded-[1.5rem] border border-white/50 bg-white/70 p-3 shadow-[0_18px_48px_rgba(70,72,212,0.18)] backdrop-blur-xl">
        <button id="evidence-analyze-btn" class="pointer-events-auto w-full bg-primary text-on-primary rounded-xl py-4 px-6 flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all group">
          <span class="material-symbols-outlined text-on-primary" data-icon="psychiatry">psychiatry</span>
          <span id="analyze-btn-label" class="font-title-sm text-title-sm text-on-primary font-semibold">${submitLabels.idle}</span>
        </button>
        <p id="submit-state" class="hidden px-2 pt-3 text-body-sm text-on-surface-variant"></p>
        <p id="submit-error" class="hidden px-2 pt-3 text-body-sm text-error"></p>
      </div>
    </div>
  `;

  const btns = container.querySelectorAll('.claim-btn');
  const descriptionField = container.querySelector('#claim-description');
  const voiceField = container.querySelector('#voice-description');
  const fileInput = container.querySelector('#evidence-file-input');
  const browseButton = container.querySelector('#browse-files-btn');
  const dropzone = container.querySelector('#evidence-dropzone');
  const selectedFileCard = container.querySelector('#selected-file-card');
  const selectedFileName = container.querySelector('#selected-file-name');
  const selectedFileHint = container.querySelector('#selected-file-hint');
  const removeFileButton = container.querySelector('#remove-file-btn');
  const fileError = container.querySelector('#file-error');
  const submitError = container.querySelector('#submit-error');
  const submitState = container.querySelector('#submit-state');
  const analyzeBtn = container.querySelector('#evidence-analyze-btn');
  const analyzeBtnLabel = container.querySelector('#analyze-btn-label');
  const voiceRecordButton = container.querySelector('#voice-record-btn');
  const voiceRecordIcon = container.querySelector('#voice-record-icon');
  const voiceWaveform = container.querySelector('#voice-waveform');
  const voiceTimer = container.querySelector('#voice-timer');
  const voicePlayback = container.querySelector('#voice-playback');
  const voiceStatus = container.querySelector('#voice-status');
  const removeVoiceButton = container.querySelector('#remove-voice-btn');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let mediaRecorder = null;
  let voiceChunks = [];
  let voiceStream = null;
  let voiceUrl = '';
  let voiceTimerId = null;
  let voiceStartedAt = 0;
  let speechRecognition = null;
  let isRecordingVoice = false;
  let transcriptBase = '';
  let finalTranscript = '';

  const refreshFileUi = () => {
    const { evidencePreviewName, evidenceNeedsReselection } = state.draftClaim;
    selectedFileCard.classList.toggle('hidden', !evidencePreviewName);
    selectedFileName.textContent = evidencePreviewName || '';
    selectedFileHint.classList.toggle('hidden', !evidenceNeedsReselection);
    browseButton.textContent = evidencePreviewName && !evidenceNeedsReselection ? 'Replace File' : 'Browse Files';
  };

  const clearFileError = () => {
    fileError.classList.add('hidden');
    fileError.textContent = '';
  };

  const setSubmitState = (mode, helperText = '') => {
    const isBusy = mode !== 'idle';
    analyzeBtn.disabled = isBusy;
    analyzeBtn.classList.toggle('opacity-70', isBusy);
    analyzeBtn.classList.toggle('cursor-not-allowed', isBusy);
    analyzeBtnLabel.textContent = submitLabels[mode] || submitLabels.idle;
    submitState.textContent = helperText;
    submitState.classList.toggle('hidden', !helperText);
  };

  const formatDuration = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const setVoiceStatus = (message, isError = false) => {
    voiceStatus.textContent = message;
    voiceStatus.classList.toggle('text-error', isError);
    voiceStatus.classList.toggle('text-on-surface-variant', !isError);
  };

  const updateVoiceTimer = () => {
    voiceTimer.textContent = formatDuration(Date.now() - voiceStartedAt);
  };

  const startVoiceTimer = () => {
    voiceStartedAt = Date.now();
    updateVoiceTimer();
    voiceTimerId = window.setInterval(updateVoiceTimer, 500);
  };

  const stopVoiceTimer = () => {
    if (voiceTimerId) {
      window.clearInterval(voiceTimerId);
      voiceTimerId = null;
    }
  };

  const setVoiceRecordingUi = (recording) => {
    voiceRecordButton.classList.toggle('bg-error-container', recording);
    voiceRecordButton.classList.toggle('border-error/30', recording);
    voiceRecordButton.classList.toggle('text-error', recording);
    voiceRecordButton.classList.toggle('bg-primary/10', !recording);
    voiceRecordButton.classList.toggle('border-primary/20', !recording);
    voiceRecordButton.classList.toggle('text-primary', !recording);
    voiceRecordIcon.textContent = recording ? 'stop' : 'mic';
    voiceRecordButton.setAttribute('aria-label', recording ? 'Stop voice recording' : 'Start voice recording');
    voiceWaveform.classList.toggle('animate-pulse', recording);
    voiceWaveform.classList.toggle('opacity-100', recording);
    voiceWaveform.classList.toggle('opacity-60', !recording);
  };

  const stopVoiceTracks = () => {
    if (!voiceStream) return;
    voiceStream.getTracks().forEach((track) => track.stop());
    voiceStream = null;
  };

  const stopSpeechRecognition = () => {
    if (!speechRecognition) return;
    try {
      speechRecognition.stop();
    } catch {}
    speechRecognition = null;
  };

  const startSpeechRecognition = () => {
    if (!SpeechRecognition) {
      setVoiceStatus('Recording audio. Speech-to-text is not available in this browser, so type a short summary above.');
      return;
    }

    transcriptBase = voiceField.value.trim();
    finalTranscript = '';
    speechRecognition = new SpeechRecognition();
    speechRecognition.lang = 'id-ID';
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      let interimTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript.trim();
        if (event.results[index].isFinal) {
          finalTranscript = `${finalTranscript} ${transcript}`.trim();
        } else {
          interimTranscript = transcript;
        }
      }

      const nextValue = [transcriptBase, finalTranscript, interimTranscript]
        .filter(Boolean)
        .join(' ')
        .trim();

      voiceField.value = nextValue;
      updateDraftClaim({ voiceDescription: nextValue });
    };

    speechRecognition.onerror = () => {
      setVoiceStatus('Recording audio. Speech-to-text stopped, but your audio preview will still be saved.');
    };

    try {
      speechRecognition.start();
    } catch {
      setVoiceStatus('Recording audio. Speech-to-text could not start in this browser.');
    }
  };

  const finishVoiceRecording = () => {
    const voiceBlob = new Blob(voiceChunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
    if (voiceUrl) {
      URL.revokeObjectURL(voiceUrl);
    }
    voiceUrl = URL.createObjectURL(voiceBlob);
    voicePlayback.src = voiceUrl;
    voicePlayback.classList.remove('hidden');
    removeVoiceButton.classList.remove('hidden');
    setVoiceStatus(
      SpeechRecognition
        ? 'Recording saved. Review the transcript above before submitting.'
        : 'Recording saved for playback. Type a short summary above before submitting.'
    );
    stopVoiceTracks();
  };

  const stopVoiceRecording = () => {
    if (!isRecordingVoice) return;
    isRecordingVoice = false;
    stopVoiceTimer();
    stopSpeechRecognition();
    setVoiceRecordingUi(false);

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    } else {
      stopVoiceTracks();
    }
  };

  const startVoiceRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setVoiceStatus('Voice recording is not supported in this browser.', true);
      return;
    }

    try {
      voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceChunks = [];
      mediaRecorder = new MediaRecorder(voiceStream);
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data?.size) {
          voiceChunks.push(event.data);
        }
      });
      mediaRecorder.addEventListener('stop', finishVoiceRecording, { once: true });
      mediaRecorder.start();

      isRecordingVoice = true;
      voicePlayback.classList.add('hidden');
      removeVoiceButton.classList.add('hidden');
      setVoiceRecordingUi(true);
      setVoiceStatus('Recording voice context...');
      startVoiceTimer();
      startSpeechRecognition();
    } catch (error) {
      stopVoiceTracks();
      setVoiceRecordingUi(false);
      setVoiceStatus(error?.name === 'NotAllowedError'
        ? 'Microphone permission was denied.'
        : 'Could not start microphone recording.', true);
    }
  };

  const clearVoiceRecording = () => {
    stopVoiceRecording();
    if (voiceUrl) {
      URL.revokeObjectURL(voiceUrl);
      voiceUrl = '';
    }
    voiceChunks = [];
    voicePlayback.removeAttribute('src');
    voicePlayback.classList.add('hidden');
    removeVoiceButton.classList.add('hidden');
    voiceTimer.textContent = '00:00';
    setVoiceStatus('Tap the mic to record voice context.');
  };

  const setFile = (file) => {
    if (!file) return;
    updateDraftClaim({
      evidenceFile: file,
      evidencePreviewName: getFilePreviewName(file),
      evidenceNeedsReselection: false
    });
    fileInput.value = '';
    refreshFileUi();
    clearFileError();
  };

  const clearFile = () => {
    updateDraftClaim({
      evidenceFile: null,
      evidencePreviewName: '',
      evidenceNeedsReselection: false
    });
    fileInput.value = '';
    refreshFileUi();
  };

  refreshFileUi();
  setSubmitState('idle');

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      updateDraftClaim({ claimType: btn.dataset.claimType });
      navigate('evidence');
    });
  });

  descriptionField.addEventListener('input', (event) => {
    updateDraftClaim({ textDescription: event.target.value });
  });

  voiceField.addEventListener('input', (event) => {
    updateDraftClaim({ voiceDescription: event.target.value });
  });

  voiceRecordButton.addEventListener('click', () => {
    if (isRecordingVoice) {
      stopVoiceRecording();
      return;
    }

    startVoiceRecording();
  });

  removeVoiceButton.addEventListener('click', clearVoiceRecording);

  browseButton.addEventListener('click', (event) => {
    event.stopPropagation();
    fileInput.click();
  });
  removeFileButton.addEventListener('click', clearFile);
  fileInput.addEventListener('change', () => setFile(fileInput.files?.[0]));

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.classList.add('border-primary', 'bg-primary/10');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-primary', 'bg-primary/10');
  });

  dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('border-primary', 'bg-primary/10');
    setFile(event.dataTransfer?.files?.[0]);
  });

  analyzeBtn.addEventListener('click', async () => {
    const { evidenceFile, evidenceNeedsReselection, claimType, textDescription, voiceDescription, refundAmount } = state.draftClaim;
    const description = textDescription.trim();
    const voice = voiceDescription.trim();

    submitError.classList.add('hidden');
    submitError.textContent = '';
    clearFileError();

    if (!evidenceFile || evidenceNeedsReselection) {
      fileError.textContent = evidenceNeedsReselection
        ? 'Please re-attach the evidence file restored from your previous draft before continuing.'
        : 'Please choose one evidence file before continuing.';
      fileError.classList.remove('hidden');
      return;
    }

    if (!description) {
      submitError.textContent = 'Please write a short problem description before starting analysis.';
      submitError.classList.remove('hidden');
      return;
    }

    try {
      setSubmitState('uploading', 'Uploading evidence asset to backend storage...');
      const uploaded = await uploadEvidence(evidenceFile);

      setSubmitState('creating', 'Creating claim record for the demo user...');
      const createdClaim = await createClaim({
        user_id: state.currentUserId,
        order_id: `order_${Date.now()}`,
        claim_type: claimType,
        file_ids: [uploaded.file_id],
        text_description: description,
        voice_description: voice || null,
        refund_amount: refundAmount
      });

      setCurrentClaim(createdClaim);
      setCurrentClaimStatus({
        claim_id: createdClaim.id,
        status: createdClaim.status,
        current_step: createdClaim.current_step,
        updated_at: createdClaim.updated_at
      });

      setSubmitState('starting', 'Starting backend analysis workflow...');
      await analyzeClaim(createdClaim.id);
      navigate('analysis');
    } catch (error) {
      setSubmitState('idle');
      submitError.textContent = error.message || 'Failed to submit claim. Make sure backend is running.';
      submitError.classList.remove('hidden');
    }
  });

  return container;
}
