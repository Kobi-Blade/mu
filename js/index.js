(function () {
	var stateEl = document.getElementById("state");
	var detEl = document.getElementById("det");
	function setState(t, c) { stateEl.textContent = t; stateEl.className = c || ""; }
	var params = new URLSearchParams(location.search);

	var key = null, fwnum = null;
	var m = /PlayStation\s+4[\/\s]([\d]+)\.([\d]+)/.exec(navigator.userAgent);
	if (m) {
		var minor = parseInt(m[2], 16);
		var ms = minor.toString(16);
		if (ms.length < 2) ms = "0" + ms;
		key = m[1] + "." + ms;
		fwnum = parseInt(m[1], 10) * 100 + parseInt(ms, 10);
	}
	var bug = null, why = "";
	var forced = params.get("bug");
	if (forced === "lapse" || forced === "poops") {
		bug = forced; why = "forced via ?bug=" + forced;
	} else if (!key) {
		why = "user-agent is not a PlayStation 4";
	} else if (fwnum <= 1202) {
		bug = "lapse"; why = key + " <= 12.02";
	} else if (fwnum >= 1250) {
		bug = "poops"; why = key + " >= 12.50";
	} else {
		why = key + " -- no working bug (lapse ends at 12.02, poops needs 12.50)";
	}
	detEl.innerHTML = "firmware <b>" + (key || "unknown") + "</b>"
		+ " &middot; bug <b>" + (bug || "none") + "</b> &middot; " + why;

	if (!bug) { setState("UNSUPPORTED FIRMWARE", "bad"); return; }

	var target = (bug === "lapse" ? "pages/run_lapse.html" : "pages/run_poops.html")
		+ location.search;
	function go() { setState("loading " + bug + " chain...", "warn");
					location.replace(target); }

	function waitForTap(msg, action) {
		setState(msg, "warn");
		function fire() {
			window.removeEventListener("click", fire);
			window.removeEventListener("keydown", fire);
			action();
		}
		window.addEventListener("click", fire);
		window.addEventListener("keydown", fire);
	}

	go();
})();
