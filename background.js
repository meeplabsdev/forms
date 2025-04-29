chrome.webRequest.onBeforeRequest.addListener(
	async (details) => {
		if (details.method !== "POST") return;
		if (details.url.includes("BAMGOTTEM")) return;

		chrome.tabs.get(details.tabId, (tab) => {
			if (chrome.runtime.lastError) {
				console.error("Tab not found:", chrome.runtime.lastError);
				return;
			}

			if (details.requestBody.raw?.[0]) {
				const body = new TextDecoder("utf-8").decode(
					details.requestBody.raw[0].bytes,
				);

				chrome.storage.local.set({
					formDetails: {
						url: details.url,
						content: body,
						title: tab.title,
						page: tab.url,
					},
				});
			}
		});
	},
	{
		urls: ["https://forms.office.com/*"],
	},
	["requestBody"],
);
