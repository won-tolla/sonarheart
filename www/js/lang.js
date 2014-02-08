var languages = {
	it_IT:	{
		slogan: 'Come dirti ti amo a ogni secondo?',
		labelHeader: 'SonarHeart',
		labelStart: 'Come dirti ti amo a ogni secondo?',
		labelName: 'Il tuo nome',
		labelSecretWord: 'La vostra parola segreta',
		
		labelSetup: 'Impostazioni',
		labelYears: 'Anni',
		labelMonths: 'Mesi',
		labelDays: 'Giorni',
		labelHours: 'Ore',
		labelMinutes: 'Minuti',
		labelSeconds: 'Secondi',
		setupConfirm: "ATTENZIONE!!!\nQuesta operazione puo' essere effettuata una sola volta.\nVuoi continuare?",
		
		labelMessage: "Messaggio",
		menuStop: 'Stop',
		menuSetup: 'Imposta tempo',
		menuMessage: 'Scrivi messaggio',
		menuStart: 'Start',
		menuDemo: 'Demo',
		menuForever: 'Per sempre',
		
		labelMenu: 'Scegli una azione',
		
		connectWith: 'Sei connesso con ',
		invalidConnect: 'Connessione non riuscita',
		breakConnect: "ATTENZIONE!!!\nVuoi interrompere il conteggio?\nQuesta operazione e' irreversibile.",
		failConnection: 'Impossibile connetersi alla rete',
		notEnabled: 'DEMO: funzione none abilitata',
		forever: "PER SEMPRE?\nQuesta operazione e' irreversibile.",
		
		intro: "SonarHeart conta il nostro tempo."
			+"<br>Per avviarlo bisogna essere in due."
			+" Ognuno scrive il proprio nome ed una parola segreta uguale per entrambi."
			+" Insieme premiamo il pulsante Start.",
		
		messages: [
		           "TVTB",
		           "TI LOVVO",
		           "QUANTO MI MANCHI",
		           "STAREMO INSIEME PER SEMPRE"
		]
	},
	en_US: {
		slogan: 'How to say I love you every second?',
		labelHeader: 'SonarHeart',
		labelStart: 'How to say I love you every second?',
		labelName: 'Your name',
		labelSecretWord: 'Your secret word',
		
		labelSetup: 'Setup',
		labelYears: 'Years',
		labelMonths: 'Months',
		labelDays: 'Days',
		labelHours: 'Hours',
		labelMinutes: 'Minutes',
		labelSeconds: 'Seconds',
		setupConfirm: "WARNING!!!\nThis operation can be done only once. \nDo you want to continue?",
		
		labelMessage: "Message",
		menuStop: 'Stop',
		menuSetup: 'Set timer',
		menuMessage: 'Write message',
		menuStart: 'Start',
		menuDemo: 'Demo',
		menuForever: 'Forever',
		
		labelMenu: 'Choice an action',
		
		connectWith: 'You are connected with ',
		invalidConnect: 'Invalid connection',
		breakConnect: "WARNING!!!\nVuoi interrompere il conteggio?\nQuesta operazione e' irreversibile.",
		failConnection: 'Fail connection',
		notEnabled: 'DEMO: funzione none abilitata',
		forever: "PER SEMPRE?\nQuesta operazione e' irreversibile.",
		
		intro: "SonarHeart count our time."
			+"<br>To start you need to be in two."
			+" Everyone writes their name and a secret word the same for both."
			+" Together we press the Start button.",
		
		messages: [
		           "TVTB",
		           "TI LOVVO",
		           "QUANTO MI MANCHI",
		           "STAREMO INSIEME PER SEMPRE"
		]
	}
};
var lang = languages.it_IT;

document.addEventListener("deviceready", setLocale, false);
function setLocale() {
	try {
		navigator.globalization.getLocaleName(
			function (locale) {
				if(typeof(languages[locale.value]) != 'undefined') {
					lang = languages[locale.value];
				}
				setLanguage();
			},
		    function () {
				setLanguage();
			}
		);
	} catch (e) {
		setLanguage();
	}
}
function setLanguage() {
	for(var index in lang) {
		var attr = lang[index];
		$('#'+index).html(lang[index]);
	}
}
