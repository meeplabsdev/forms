chrome.storage.local.get("formDetails", (result) => {
	const details = result.formDetails;
	if (details?.title) {
		document.getElementsByClassName("notFound")[0].style = "display: none;";
		document.getElementsByClassName("content")[0].style = "display: block;";

		document.getElementById("formLabel").innerText = details.title;
		document.getElementById("formLabel").href = details.page;

		const goButton = document.getElementById("goButton");
		goButton.onclick = sendForms;
	}
});

function sendForms() {
	chrome.storage.local.get("formDetails", (result) => {
		const details = result.formDetails;
		const num = document.getElementById("submissionCount").value;
		if (num && num > 0) {
			updateProgress(0);
			(async () => {
				for (let i = 0; i < num; i++) {
					try {
						await fetch(`${details.url}#BAMGOTTEM`, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: details.content,
						});
					} catch (err) {
						console.error("Resend failed:", err);
					}

					updateProgress(((i + 1) / num) * 100);
				}
			})();
		}
	});
}

function updateProgress(percentage) {
	const progressBar = document.getElementById("progress-bar");
	progressBar.style.width = `${percentage}%`;
}
