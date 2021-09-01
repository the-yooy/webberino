const btnArr = [];
const initPopup = async ({ runtime }) => {
	const { currentTabData } = await runtime.sendMessage({
		command: 'openPopup',
	});
	const { openChat, chats } = currentTabData;
	for (let chat of chats) {
		chatButton = createButton(chat);
		chat === openChat && setActiveChat(chatButton, chat);
	}
};
initPopup(browser);
async function setActiveChat(chatButton, value) {
	btnArr.forEach(elm => {
		if (elm === chatButton) {
			elm.style.backgroundColor = '#9147ff';
			elm.style.color = 'white';
		} else {
			elm.style.color = 'white';
			elm.style.backgroundColor = '#6a6a6a';
		}
	});
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });
	browser.tabs.sendMessage(tabs[0].id, {
		command: 'replaceChat',
		chat: value,
	});
}
const createButton = value => {
	const btnsContainer = document.createElement('div');
	btnsContainer.setAttribute('class', 'btns-container');

	const chatButton = document.createElement('button');

	// const deleteChatButton = document.createElement('button');
	// btnsContainer.append(deleteChatButton);
	// deleteChatButton.setAttribute('class', 'chat-delete-button');

	chatButton.textContent = value;
	chatButton.setAttribute('class', 'chat-button');
	chatButton.addEventListener('click', () => {
		setActiveChat(chatButton, value);
	});
	btnArr.unshift(chatButton);
	btnsContainer.append(chatButton);
	document.getElementById('chats').prepend(btnsContainer);
	return chatButton;
};

document
	.getElementById('chatInput')
	.addEventListener('keypress', function (ev) {
		const {
			key,
			target: { value },
		} = ev;
		if (key === 'Enter' && value) {
			browser.runtime
				.sendMessage({ command: 'setButton', value })
				.then(handleSetButton);
			ev.target.value = null;
		}
	});

function handleSetButton(message) {
	const chatButton = createButton(message.value);
	setActiveChat(chatButton, message.value);
}
