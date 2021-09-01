const initChatElm = document.getElementsByClassName('stream-chat')[0];
initChatElm.id = 'initChat';

const chatContainer = initChatElm.parentNode;
let openChatId = 'initChat';

const replaceChat = ({ chat }) => {
	const chatElmId = 'chat-iframe-' + chat;
	const loadedChat = document.getElementById(chatElmId);
	const openChatElm = document.getElementById(openChatId);
	let elm;
	if (!loadedChat) {
		elm = document.createElement('iframe');
		elm.id = chatElmId;
		elm.src =
			'https://www.twitch.tv/embed/' +
			chat +
			'/chat?darkpopout=true&parent=twitch.tv';
		elm.width = '100%';
		elm.height = '100%';

		chatContainer.appendChild(elm);
	} else {
		elm = document.getElementById(chatElmId);
		//if the loaded chat is the open chat just remove the display: none
		loadedChat === openChatElm && elm.removeAttribute('style');
	}
	// if the  open chat is the inital chat remove initial chat element
	openChatId === 'initChat' && initChatElm.remove();

	//if the loaded chat isnt the open chat hide it
	if (loadedChat !== openChatElm) {
		openChatElm.setAttribute('style', 'display: none !important');
		elm.removeAttribute('style');
	}
	openChatId = chatElmId;
	return chat;
};

browser.runtime.onMessage.addListener(function (message) {
	if ((message.command = 'replaceChat')) {
		const chat = replaceChat(message);
		browser.runtime.sendMessage({
			command: 'setOpenChat',
			value: chat,
		});
	}
});
