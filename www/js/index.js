var server = 'http://sonarheart.wontolla.eu/server.php?callback=?';
var fileconfig = 'SonarHeart.cnf';
var appdir = 'SonarHeart'; 
var browser = typeof(LocalFileSystem) == 'undefined';
var secondsRefresh = 60;

var id = null;
var name1 = '';
var name2 = '';
var status = 0;
var date_start = null;
var date_end = null;
var message1 = '';	
var message2 = '';
var color = 'white';
var bConnecting = false;

$.ajaxSetup({
	url: server,
	dataType: 'jsonp',
	type: 'post',
	beforeSend: function() {
		$.mobile.showPageLoadingMsg();
	},
	complete: function(){
		$.mobile.hidePageLoadingMsg();
	},
	success: function() {},
	timeout: 8000
});

$(document).on("pageinit",function() {
	document.addEventListener("deviceready", loadConfig, false);

	$(window).bind('orientationchange resize', function(event){
		$("#main").css("height",$(window).height());
		$("#labelHeader").css("font-size",($(window).height()/20)+"px" )
		$(".digits, #name1, #name2").css("font-size",($(window).height()/6)+"px" )
		$("#message1, #message2").css("font-size",($(window).height()/30)+"px" )
		console.log('resize',event);
	});
	$(window).resize();

	$("#menuStop").on("tap", function() {
		$("#popupMenu").popup( "close" );
		if (checkConnection(true) && confirm(lang.breakConnect)) {
			$.ajax({
				data: {
					id: id,
					action: 'stop',
					now: now()
				}
			}).done(function(data){
				setData(data);
			}).fail(function() {
				failConnection();
			});
		}
	});

	$("#menuReset").on("tap", function() {
		$("#popupMenu").popup( "close" );
		if (checkConnection(true) && confirm(lang.reset)) {
			$.ajax({
				data: {
					id: id,
					action: 'reset',
					now: now()
				}
			}).done(function(data){
				setData(data);
			}).fail(function() {
				failConnection();
			});
		}
	});
	
	
	$("#menuForever").on("tap", function() {
		$("#popupMenu").popup( "close" );
		if (checkConnection(true) && confirm(lang.forever)) {
			$.ajax({
				data: {
					id: id,
					action: 'forever',
					now: now()
				}
			}).done(function(data){
				setData(data);
			}).fail(function() {
				failConnection();
			});
		}
	});

	$("#heart").on("taphold", doMenu);
	
	// start
	$("#popupStartCancel").on("tap", function() {
		$("#popupStart").popup( "close" );
	});
	$("#popupStartOk").on("tap", function() {
		$("#popupStart").popup( "close" );
   		if(checkConnection(true)) {
   			bConnecting = true;
			$.ajax({
				data: {
					name1: $("#start_name1").val(),
					name2: $("#start_name2").val(),
					secretWord: $("#secret_word").val(),
					action: 'start',
					now: now(),
					dev_uuid: device.uuid,
					dev_cordova: device.cordova,
					dev_version: device.version,
					dev_model: device.model,
					dev_platform: device.platform
				}
			}).done(function(data){
				if( typeof(data.name2) != 'undefined' ) {
					if( confirm(lang.connectWith+data.name2) ) {
						setData(data);
					} else {
						$.ajax({
							data: {
								id: data.id,
								action: 'unlink',
								now: now()
							}
						}).done(function(data){
							setData(data);
						}).fail(function(data) {
							failConnection();
						});
					}
				} else {
					alert(lang.invalidConnect);
					pulse();
				}
	   			bConnecting = false;
			}).fail(function() {
				failConnection();
				pulse();
	   			bConnecting = false;
			});
   		}
   	});
	
	// setup
	$("#buttonSetup").on("tap", function() {
		$("#setup_years").val($("#years").html());
		$("#setup_months").val($("#months").html());
		$("#setup_days").val($("#days").html());
		$("#setup_hours").val($("#hours").html());
		$("#setup_minutes").val($("#minutes").html());
		$("#setup_seconds").val($("#seconds").html());
	});
	$("#popupSetupCancel").on("tap", function() {
		$("#popupSetup").popup( "close" );
	});
	$("#popupSetupOk").on("tap", function() {
		$("#popupSetup").popup( "close" );
		if(checkConnection(true) && confirm(lang.setupConfirm)) {
			$.ajax({
				data: {
					id: id,
					action: 'settime',
					years: $("#setup_years").val(),
					months: $("#setup_months").val(),
					days: $("#setup_days").val(),
					hours: $("#setup_hours").val(),
					minutes: $("#setup_minutes").val(),
					seconds: $("#setup_seconds").val(),
					now: now()
				}
			}).done(function(data){
				setData(data);
			}).fail(function(data) {
				failConnection();
				$("#popupSetup").popup( "open" );
			});
   		}
   	});
	
	$("#popupMessageCancel").on("tap", function() {
		$("#popupMessage").popup( "close" );
	});
	$("#popupMessageOk").on("tap", function() {
		$("#popupMessage").popup( "close" );
		if(checkConnection(true)) {
			$.ajax({
				data: {
					id: id,
					action: 'message',
					message: $("#your_message").val(),
					now: now()
				}
			}).done(function(data){
				setData(data);
			}).fail(function(data) {
				failConnection();
				$("#popupMessage").popup( "open" );
			});
   		}
   	});
	
});

function pad(number) {
	number = ("00" + number).slice(-2);
	return number;
}

var interval = 0;
function pulse() {
	var d2 = new Date;
	
	if( date_start == null ) {
		$("#years").removeClass("t1");
		$("#months").removeClass("t2");
		$("#days").removeClass("t3");
		$("#hours").removeClass("t4");
		$("#minutes").removeClass("t5");
		$("#seconds").removeClass("t6");
		$("#message1").html(lang.slogan);
		$("#game table").removeClass("pulse");
	} else if( date_end == null ) {
		$("#years").addClass("t1");
		$("#months").addClass("t2");
		$("#days").addClass("t3");
		$("#hours").addClass("t4");
		$("#minutes").addClass("t5");
		$("#seconds").addClass("t6");
		$("#game table").addClass("pulse");
	} else {
		$("#game table")
			.removeClass("pulse")
			.css("background-image", "url(images/heart2.png)");

		d2 = date_end;

		$("#years").removeClass("t1");
		$("#months").removeClass("t2");
		$("#days").removeClass("t3");
		$("#hours").removeClass("t4");
		$("#minutes").removeClass("t5");
		$("#seconds").removeClass("t6");
	}

	if( date_start != null ) {
		var d = {}
		d.years = d2.getUTCFullYear() - date_start.getUTCFullYear();
		d.months = d2.getUTCMonth() - date_start.getUTCMonth();
		d.days = d2.getUTCDate() - date_start.getUTCDate();
		d.hours = d2.getUTCHours() - date_start.getUTCHours();
		d.minutes = d2.getUTCMinutes() - date_start.getUTCMinutes();
		d.seconds = d2.getUTCSeconds() - date_start.getUTCSeconds();
		while (d.seconds < 0) {
			d.seconds += 60;
			d.minutes -= 1;
		}
		while (d.minutes < 0) {
			d.minutes += 60;
			d.hours -= 1;
		}
		while (d.hours < 0) {
			d.hours += 24;
			d.days -= 1;
		}
		while (d.days < 0) {
			var t2 = d2.getTime();
			var dtmp = new Date(d2.getUTCFullYear(), d2.getUTCMonth(), 1);
			var dtmp = new Date(dtmp - 1);
			d.days += dtmp.getUTCDate();
			d.months -= 1;
		}
		while (d.months < 0) {
			d.months += 12;
			d.years -= 1;
		}
	
		$("#years").html(pad(d.years));
		$("#months").html(pad(d.months));
		$("#days").html(pad(d.days));
		$("#hours").html(pad(d.hours));
		$("#minutes").html(pad(d.minutes));
		$("#seconds").html(pad(d.seconds));
		$("#name1").html(name1.slice(0,1));
		$("#name2").html(name2.slice(0,1));
		$("#message1").html(message1);
		$("#message2").html(message2);

//		$("#game table").css("background-size",""+(40+50*(d.seconds % 2))+"%" );
	}

	if(id == null || date_end != null) {
		if(interval!=0) {
			self.clearInterval(interval);
			interval = 0;
		}
		if(intervalRefresh!=0) {
			self.clearInterval(intervalRefresh);
			intervalRefresh = 0;
		}
		if( id == null ) {
			setTimeout(function () {
//				$("#popupStart").popup("open");
				doMenu();
			}, 100);
		}
	} else if(id != null) {
		if(interval==0) interval = self.setInterval("pulse()", 1000);
		if(intervalRefresh==0) intervalRefresh = self.setInterval("refreshConfig()", 1000*secondsRefresh);
	}
}

function fill_options(id,min,max,text) {
	for(var i=min; i<=max; i++) {
		$("<option value='"+pad(i)+"'"+(i==0?" selected":"")+">"+pad(i)+" "+text+"</option>").appendTo(id);
	}
}


function loadConfig() {
	document.addEventListener("pause", pause, false);
	document.addEventListener("resume", resume, false);
	document.addEventListener("menubutton", doMenu, false);
	setColor(color);

	try {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
			function(fileSystem) { // success
				fileSystem.root.getDirectory(appdir, null,
					function(dirEntry) {
						dirEntry.getFile(fileconfig, null,
							function(fileEntry) { // success
								fileEntry.file(
									function(file) { // success
										var reader = new FileReader();
										reader.onloadend = function(evt) {
											var arr = evt.target.result.split("|");
											if(arr.length>0 && arr[0]!='') id = arr[0];
											if(arr.length>1) name1 = arr[1];
											if(arr.length>2) name2 = arr[2];
											if(arr.length>3) status = parseInt(arr[3]);
											if(arr.length>4 && arr[4]!="") date_start = new Date(arr[4]);
											if(arr.length>5 && arr[5]!="") date_end = new Date(arr[5]);
											if(arr.length>6) message1 = arr[6];
											if(arr.length>7) message2 = arr[7];
											if(arr.length>8) setColor(arr[8]);
											pulse();
										};
										reader.readAsText(file);
									},
									pulse
								);
							}, 
							pulse
						);
					},
					pulse
				);
			},
			pulse
		);
	} catch (e) {
		pulse();
	   	//statements to handle any exceptions
		console.log('loadConfig: '+e); // pass exception object to error handler
	}
}
function saveConfig() {
	try {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
			function(fileSystem) { // success
				fileSystem.root.getDirectory(appdir, {create: true, exclusive: false},
					function(dirEntry) {
						dirEntry.getFile(fileconfig, {create: true, exclusive: false},
							function(fileEntry) { // success
								fileEntry.createWriter(
									function(writer) { // success
								        writer.onwriteend = function(evt) {
//											        	alert('writeend');
								        };
								        var now = new Date();
								        var str = 
								        	(id ? id : "")
							        		+"|"+name1
							        		+"|"+name2
							        		+"|"+status
							        		+"|"+(date_start ? date_start.toGMTString() : "")
							        		+"|"+(date_end ? date_end.toGMTString() : "")
							        		+"|"+message1
							        		+"|"+message2
							        		+"|"+color;
								        writer.write(str);
									},
									function () {alert(1);}
								);
							}, 
							function () {alert(2);}
						);	
					},
					function () {alert(3);}
				);
			},
			function () {alert(4);}
		);
	} catch (e) {
//		alert('saveConfig: '+e);
	}
}

function fail(error) {
	alert('fail: '+error.code);	
	pulse();
}

var intervalRefresh = 0;
function refreshConfig(fDone) {
	if(id != null && checkConnection(false)) {
		$.ajax({
			data: {
				id: id,
				now: now()
			}
		}).done(function(data){
			setData(data);
			if(typeof(fDone)=='function') {
				fDone();
			}
		}).fail(function(data) {
			//failConnection();
		});
	} else if(typeof(fDone)=='function') {
		fDone();
	}
}


function checkConnection(showAlert) {
	try {
		if(navigator.connection.type == Connection.NONE) {
			if(showAlert) alert('Connessione non disponibile');
			return false;
		}
	} catch (e) {
		console.log('checkConnection: '+e);
	}
	
	return true;
}

function setData(data) {
	if(typeof(data.id) == 'undefined') {
		init();
	} else if(typeof(data.status)!='undefined' && data.status == '9') {
		alert('effettuato reset');
		init();
	} else {
		id = data.id;
		if(typeof(data.date_start) != 'undefined') {
			if( data.date_start == null || data.date_start == "" ) {
				date_start = null;
			} else {
				date_start = new Date(data.date_start);
			}
		}
		if(typeof(data.date_end) != 'undefined') {
			if( data.date_end == null || data.date_end == "" ) {
				date_end = null;
			} else {
				date_end = new Date(data.date_end);
			}
		}
		if(typeof(data.name1) != 'undefined') name1 = data.name1;
		if(typeof(data.name2) != 'undefined') name2 = data.name2;
		if(typeof(data.status) != 'undefined') status = data.status;
		if(typeof(data.message1) != 'undefined') message1 = data.message1;
		if(typeof(data.message2) != 'undefined') message2 = data.message2;
	}
	saveConfig();
	pulse();
	
	return id;
}

function failConnection() {
	alert(lang.failConnection);
}

function pause() {
	$("#years").removeClass("t1");
	$("#months").removeClass("t2");
	$("#days").removeClass("t3");
	$("#hours").removeClass("t4");
	$("#minutes").removeClass("t5");
	$("#seconds").removeClass("t6");
	$("#game table").removeClass("pulse");
	if(interval>0) {
		self.clearInterval(interval);
		interval = 0;
	}
	if(intervalRefresh>0) {
		self.clearInterval(intervalRefresh);
		intervalRefresh = 0;
	}
}

function resume() {
	refreshConfig();
}

function setColor(col) {
	if(color=='white' || color=='black') {
		$("#game table").removeClass(color).addClass(col);
		color = col;
	}
}

function doMenu() {
	if(bConnecting) return;
	
	refreshConfig(function() {
		if(date_start==null) {
			$("#popupStart").popup("open");
		} else if(date_end==null) {
			$("#menuSetup,#menuStop,#menuMessage,#menuForever").parent().parent().parent().show();
			$("#menuReset").parent().parent().parent().hide();
	//		if(status==0) {
	//			$("#menuSetup").parent().parent().parent().show();
	//		} else {
	//			$("#menuSetup").parent().parent().parent().hide();
	//		}
			$("#popupMenu").popup("open");
		} else if(status==0) {
			$("#menuReset").parent().parent().parent().show();
			$("#menuSetup,#menuStop,#menuMessage,#menuForever,#menuStart").parent().parent().parent().hide();
			$("#popupMenu").popup("open");
		}
	});
}

function now() {
	var d = new Date();
	return d.getUTCFullYear()
		+'-'+pad(d.getUTCMonth()+1)
		+'-'+pad(d.getUTCDate())
		+' '+pad(d.getUTCHours())
		+':'+pad(d.getUTCMinutes())
		+':'+pad(d.getUTCSeconds())
		+' GMT';

	return d.toGMTString();
}

function init() {
	id = null;
	name1 = '';
	name2 = '';
	status = 0;
	date_start = null;
	date_end = null;
	message1 = null;
	message2 = null;
	$("#years,#months,#days,#hours,#minutes,#seconds").html("00");
	$("#name1,#name2,#message1,#message2").html("");
	$("#game table").css("background-image","url(images/heart1.png)");

}