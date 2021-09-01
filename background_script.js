const { tabs, runtime, browserAction } = browser;

const tabsContainer = new Map();
let tabId = 0;

//activates browserAction on twitch tab
function activateBrowserAction(browserAction, tabs) {
	browserAction.disable();
	tabs.onUpdated.addListener(
		function (_tabId, changeInfo, tabInfo) {
			const { url, status } = changeInfo;
			if (status === 'loading' && url) {
				if (!tabsContainer.has(tabId)) {
					initChat = url.split('/').pop();
					tabsContainer.set(tabId, {
						openChat: initChat,
						chats: new Set([initChat]),
					});
				}
			}
			if (status === 'complete') {
				browserAction.enable(tabId);
			}
		},
		{ urls: ['*://*.twitch.tv/*'] },
	);
}
tabs.onActivated.addListener(function (activeInfo) {
	tabId = activeInfo.tabId;
});

activateBrowserAction(browserAction, tabs);

function handleMessage(req, sender, sendRes) {
	const currentTabData = tabsContainer.get(tabId);
	if (req.command === 'setButton') {
		currentTabData.openChat = req.value;
		currentTabData.chats.add(req.value);
		sendRes(req);
	}
	if (req.command === 'setOpenChat') {
		currentTabData.openChat = req.value;
		currentTabData.chats.add(req.value);
	}
	if (req.command === 'openPopup') {
		sendRes({
			currentTabData,
		});
	}
}

runtime.onMessage.addListener(handleMessage);
