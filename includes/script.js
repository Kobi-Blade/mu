let timerId = null;
const label = document.getElementById("autoJbLabel");
const checkbox = document.getElementById("autoJbInput");
const jailbreakBtn = document.getElementById("jailbreak");
const UAElement = document.getElementById("UA");

const storedAutoJb = localStorage.getItem("autoJb");
let autoJbValue = storedAutoJb !== null ? storedAutoJb === "true" : true;

// choose one of kernel exploits
var exploitChain = localStorage.getItem("exploitChain") || "lapse";
const netctrlRadio = document.getElementById("netctrl-exploit");
const lapseRadio = document.getElementById("lapse-exploit");
const kexForm = document.getElementById("kernel-options");

// Show user agent
UAElement.innerText += " " + navigator.userAgent;

kexForm.addEventListener("change", function (event) {
  localStorage.setItem("exploitChain", event.target.value);
  exploitChain = event.target.value;
});

// Jailbreak execution
jailbreakBtn.addEventListener("click", function () {
  jailbreakBtn.disabled = true;
  stopInterval();
  doJb();
});

checkbox.addEventListener("change", function () {
  localStorage.setItem("autoJb", checkbox.checked);

  if (checkbox.checked === true && jailbreakBtn.disabled === false) {
    jailbreakCountdown();
    return;
  }

  stopInterval();
});

function stopInterval() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }

  label.textContent = "Auto Jailbreak";
}

function jailbreakCountdown() {
  stopInterval();

  let countdown = 5;
  label.textContent = `Auto Jailbreaking in: ${countdown}`;

  timerId = setInterval(() => {
    countdown--;

    if (countdown <= 0) {
      stopInterval();
      jailbreakBtn.disabled = true;
      label.textContent = "Executing";
      doJb();
      return;
    }

    label.textContent = `Auto Jailbreaking in: ${countdown}`;
  }, 1000);
}

function cacheProgress(e) {
  var Percent = Math.round((e.loaded / e.total) * 100);
  document.title = "Caching: " + Percent + "%";
}

function displayCacheProgress() {
  setTimeout(function () {
    document.title = "\u2713";
  }, 1000);

  setTimeout(function () {
    document.title = "CSSFontFace exploit";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.applicationCache) {
    window.applicationCache.addEventListener("progress", cacheProgress, false);
    window.applicationCache.oncached = function () { displayCacheProgress(); };
    window.applicationCache.onupdateready = function () { displayCacheProgress(); };
  }

  if (exploitChain === "netctrl") {
    netctrlRadio.checked = true;
  } else {
    lapseRadio.checked = true;
  }

  checkbox.checked = autoJbValue;

  if (autoJbValue) {
    jailbreakCountdown();
  }
});
