import { S } from "./strings.js";
import { qsDoc } from "./ui/dom.js";
import { mountSetupView, showSetupError } from "./ui/setupView.js";
import { parseSetup, SessionController } from "./sessionController.js";
import { mountPlayView } from "./ui/playView.js";
import { showSummary } from "./ui/summaryView.js";

const viewSetup = qsDoc("#view-setup");
const viewPlay = qsDoc("#view-play");
const viewSummary = qsDoc("#view-summary");

/** @type {SessionController | null} */
let session = null;

function show(el) {
  viewSetup.hidden = el !== viewSetup;
  viewPlay.hidden = el !== viewPlay;
  viewSummary.hidden = el !== viewSummary;
}

function startSummary() {
  if (!session) return;
  show(viewSummary);
  showSummary(viewSummary, session.summaryLines(), session.attackMasteryRows(), () => {
    session = null;
    viewPlay.innerHTML = "";
    mountSetup();
  });
}

function startPlay() {
  if (!session) return;
  show(viewPlay);
  mountPlayView(viewPlay, session, (finished) => {
    if (finished) startSummary();
  });
}

function mountSetup() {
  show(viewSetup);
  mountSetupView(viewSetup, (payload) => {
    const parsed = parseSetup(payload.allowDual, payload.mode, payload.nRaw);
    if (!parsed.ok) {
      showSetupError(viewSetup, "invalid_n");
      return;
    }
    session = new SessionController(parsed.settings);
    startPlay();
  });
}

document.title = S.appTitle;
mountSetup();
