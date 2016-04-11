
var IMAGE_PATH='/includes/images/';
var FAM_ICON='/includes/images/famfamfam_silk_icons/';
var urlVars=getUrlVars();

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = Base64._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}
		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = Base64._utf8_decode(output);
		return output;
	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 		for (var n = 0; n < string.length; n++) {
 			var c = string.charCodeAt(n);
 			if (c < 128) {utftext += String.fromCharCode(c);}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
 			c = utftext.charCodeAt(i);
 			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 		}
 		return string;
	}
}

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

Number.prototype.formatMoney = function(c, d, t){
var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

/*! jQuery JSON plugin 2.4.0 | code.google.com/p/jquery-json */
(function($){'use strict';var escape=/["\\\x00-\x1f\x7f-\x9f]/g,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},hasOwn=Object.prototype.hasOwnProperty;$.toJSON=typeof JSON==='object'&&JSON.stringify?JSON.stringify:function(o){if(o===null){return'null';}
var pairs,k,name,val,type=$.type(o);if(type==='undefined'){return undefined;}
if(type==='number'||type==='boolean'){return String(o);}
if(type==='string'){return $.quoteString(o);}
if(typeof o.toJSON==='function'){return $.toJSON(o.toJSON());}
if(type==='date'){var month=o.getUTCMonth()+1,day=o.getUTCDate(),year=o.getUTCFullYear(),hours=o.getUTCHours(),minutes=o.getUTCMinutes(),seconds=o.getUTCSeconds(),milli=o.getUTCMilliseconds();if(month<10){month='0'+month;}
if(day<10){day='0'+day;}
if(hours<10){hours='0'+hours;}
if(minutes<10){minutes='0'+minutes;}
if(seconds<10){seconds='0'+seconds;}
if(milli<100){milli='0'+milli;}
if(milli<10){milli='0'+milli;}
return'"'+year+'-'+month+'-'+day+'T'+
hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
pairs=[];if($.isArray(o)){for(k=0;k<o.length;k++){pairs.push($.toJSON(o[k])||'null');}
return'['+pairs.join(',')+']';}
if(typeof o==='object'){for(k in o){if(hasOwn.call(o,k)){type=typeof k;if(type==='number'){name='"'+k+'"';}else if(type==='string'){name=$.quoteString(k);}else{continue;}
type=typeof o[k];if(type!=='function'&&type!=='undefined'){val=$.toJSON(o[k]);pairs.push(name+':'+val);}}}
return'{'+pairs.join(',')+'}';}};$.evalJSON=typeof JSON==='object'&&JSON.parse?JSON.parse:function(str){return eval('('+str+')');};$.secureEvalJSON=typeof JSON==='object'&&JSON.parse?JSON.parse:function(str){var filtered=str.replace(/\\["\\\/bfnrtu]/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered)){return eval('('+str+')');}
throw new SyntaxError('Error parsing JSON, source is not valid.');};$.quoteString=function(str){if(str.match(escape)){return'"'+str.replace(escape,function(a){var c=meta[a];if(typeof c==='string'){return c;}
c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+str+'"';};}(jQuery));

String.prototype.ucwords = function() {
    str = this.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function($1){
            return $1.toUpperCase();
        });
}

Object.object_size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var sortObjectByKey = function(obj){
    var keys = [];
    var sorted_obj = {};
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            keys.push(key);
        }
    }
    keys.sort();
    jQuery.each(keys, function(i, key){
        sorted_obj[key] = obj[key];
    });
    return sorted_obj;
};

function hermesAjax(url, mode,data) {
	if(Object.prototype.toString.call(data)==='[object Object]'){
		if($.cookie("PHPSESSID")!=""){data['token']=$.cookie("PHPSESSID");}
		data['mode']=mode;
	}
	else{
		if($.cookie("PHPSESSID")!=""){data+='&token='+$.cookie("PHPSESSID");}
		data+='&mode='+mode;
	}
	var $jqxhr=$.ajax({
		type: 'POST',
		url: url,
		data: data,
		dataType: 'json'
	})
	return $jqxhr;
};

function elcid_quick_person_add(){
	window.open("quick_person.php","myWin","toolbar=no, directories=no, location=no, status=no, menubar=no, resizable=no, scrollbars=yes, width=800, height=550");
}

function select_building(building,building_name,extra_vars){
   var field_name='';
   var field_value='';
   var fields=[];

   fields[0]="building=building";
   fields[1]="building_name=building_name";

   var evsplit=extra_vars.split('&');
   for(i=0;i<evsplit.length;i++){
      fields[i+2]=evsplit[i];
   }

   for(i=0;i<fields.length;i++){
      var fsplit=fields[i].split('=');
      field_name=fsplit[0];
      field_value=building;
      if(fsplit[1]=="building_name"){field_value=building_name;}
      var fld=window.opener.document.getElementById(field_name);
      if(fld!=null){
         switch(fld.getAttribute("type")){
            case "text":
            case "hidden":
               fld.value=unescape(field_value);
            break;
            default:
               fld.innerHTML=unescape(field_value);
         }
      }
   }
   window.close();
}

function select_elcid_location(pkey,url){
	window.opener.document.form1.action=unescape(url)+'&location='+pkey;
	window.opener.document.form1.submit();
	window.close();
}

function change_tab(id){
	var display;
	var className;
	for(i=0;i<section_tabs.length;i++){
		if(id+"_div"==section_tabs[i]+"_div"){display="block";className="active";}
		else{display="none";className="inactive";}
		document.getElementById(section_tabs[i]+"_div").style.display=display;
		document.getElementById(section_tabs[i]+"_tab").className=className;
	}
}

function getUrlVars(){
	var vars = [], hash
	var href=window.location.href;
	if(href.indexOf('#')>0){href=href.substring(0,href.indexOf('#'));}
	var hashes = href.slice(href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function isNumeric(n){
	var n2 = n;
	n = parseFloat(n);
	return (n!='NaN' && n2==n);
}

function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function randomString(len){
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = len;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return  randomstring;
}

function xmlEncode(str){
	return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function EncodeQueryData(data){
	var ret = [];
	for (var d in data)
	ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
	return ret.join("&");
}

function alertDialog(msg,width,height){
	if(!width){width=500;}
	if(!height){height=230;}
	if($("#alertDialog").length==0){$("body").append('<div id="alertDialog" title="Alert" style="display:none;"><p><div class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></div><div id="alertMessage" style="font-size:14px;"></div></p></div>');}
	$("div#alertDialog div:eq(1)").html(msg.replace(/\n/g,"<br>"));
	$("div#alertDialog").dialog({
		width: width,
		height: height,
		resizable: false,
		modal: true,
		buttons: {Ok: function() {
			$(this).dialog('close');
		}}
	});
}

function confirmDialog(msg,okFunc,cancelFunc,title,width,height,btnNames){
	if(!width){width=400;}
	if(!height){height=160;}
	if(!btnNames){btnNames=['OK','Cancel'];}
	if($("#confirmDialog").length==0){$("body").append('<div id="confirmDialog" title="Confirm" style="display:none;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span><span id="confirmMessage"></span></p></div>');}
	$("div#confirmDialog span:eq(1)").html(msg.replace(/\n/g,"<br>"));
	$("div#confirmDialog").dialog({
		"title": title,
		width: width,
		height: height,
		resizable: false,
		modal: true,
		buttons: [
			{
				text:btnNames[0],
				click: function(){
					if (typeof (okFunc) == 'function') { setTimeout(okFunc, 50); }
					$(this).dialog('close');
				}
			},
			{
				text:btnNames[1],
				click: function(){
					if (typeof (cancelFunc) == 'function') { setTimeout(cancelFunc, 50); }
					$(this).dialog('close');
				}
			}
		]
	});
}

$(document).ready(function(){
	jQuery.fn.ELCIDPersonSearch=function(options) {
		var defaults={
			source:0,
			url:"",
			title:"ELCID Person Search",
			mapFields:{}
		};
		var settings=$.extend(defaults,options||{});
		return this.each(function() {
			var $eps="";
			$(this).click(function() {
				if($("#ELCIDPersonSearchDialog").length==0){
					var $dlg=$('<div id="ELCIDPersonSearchDialog" style="display:block;" title="'+settings.title+'"></div>');
					var $dlg_tbl=$('<table class="primary" style="width:400px;margin:10px auto 10px auto;"><thead><tr><th colspan="7" class="ginablue">Search by the first letter of the last name</th></tr></thead></table>');
					var $dlg_tbl_tbody=$('<tbody><tr><td><input type="button" value="A-D"></td><td><input type="button" value="E-H"></td><td><input type="button" value="I-L"></td><td><input type="button" value="M-P"></td><td><input type="button" value="Q-T"></td><td><input type="button" value="U-Z"></td><td><input type="button" value="ALL"></td></tr><tr><td colspan="7">People Found:&nbsp;<span style="font-weight:bold;" id="eps_16789_span">0</span></td></tr><tr><td colspan="7"></td></tr></tbody>');
					var $dlg_tbl_tbody_select=$('<div id="eps_div"><select id="eps_16789" name="eps_16789" data-placeholder="Click one of the above buttons..."></select></div><div id="LDAPSearchLoading"></div>');
					$("tr:eq(2) td",$dlg_tbl_tbody).append($dlg_tbl_tbody_select);
					$("input:button",$dlg_tbl_tbody).click(function(){
						var sletter='',eletter='';letter='';btn_val=$(this).val();
						if(btn_val=='ALL'){sletter='A';eletter='Z';}
						else{
							letter=btn_val.split('-');
							sletter=letter[0];
							eletter=letter[1];
						}
						$.ajax({
							type: 'POST',
							url: '/includes/ajax/ELCIDPerson.php',
							data: 'token='+$.cookie('PHPSESSID')+'&source='+settings.source+'&sletter='+sletter+'&eletter='+eletter,
							beforeSend :function(){
								$('#LDAPSearchLoading').show();
								$("#eps_div").hide();
							},
							success: function(data){
								$('#LDAPSearchLoading').hide();
								$eps=$("select#eps_16789");
								$eps.html("");
								i=0;
								$(data['results']).each(function(k,v){
									$eps.append('<option value="'+v['pkey']+'">'+v['lname']+', '+v['fname']+' &lt;'+v['orgName']+'&gt;</option>');
									i++;
								});
								$("#eps_16789_span").html(i);
								$eps.trigger("chosen:updated");
								$("#eps_div").show();

							},
							dataType:'json'
						});
					}).css({"font-size":"14px","margin":"10px 5px"});
					$dlg_tbl.append($dlg_tbl_tbody);
					$dlg.append($dlg_tbl);
					$dlg.append('<div style="width:450px;margin:10px auto;font-size:13px;">If you cannot find the person you are looking for, then this person must be added to ELCID.</div>');
					$("body").append($dlg);
					$eps=$("select#eps_16789");
					if (!jQuery().chosen){
						$.getScript( '/includes/chosen/chosen.jquery.min.js').done(function(){
							$("head").append('<link rel="stylesheet" href="/includes/chosen/chosen.css" type="text/css">');
							setTimeout(function(){$eps.chosen({"width":"95%"});},50);
						});
					}
					else{setTimeout(function(){$eps.chosen({"width":"95%"});},50);}
				}
				$epsd=$("#ELCIDPersonSearchDialog");
				$epsd.dialog({
					width: 550,
					height: 535,
					buttons: {
						"Select": function() {
							if($eps.val()==""||$eps.val()==null){alertDialog('You must select a person');}
							else{
								if(settings.url==0){
									var vl="";
									$.each(settings.mapFields,function(i,v){
										if(i==0){vl=$eps.val();}
										if(i==1){vl=$("option:selected",$eps).text();}
										switch($('#'+v).attr('type')){
											case 'text':
												$('#'+v).val(vl);
											break;
											case 'hidden':
												$('#'+v).val(vl);
											break;
											case 'textarea':
												$('#'+v).val(vl);
											break;
											default:
												$('#'+v).html(vl);
											break;
										}
									});
									$epsd.dialog('close');
								}
								else{window.location=settings.url.replace("###",$eps.val());}
							}
						},
						Cancel: function(){$epsd.dialog('close');}
					}
				});
			});
		});
	};

	jQuery.fn.ELCIDPersonSearchList=function(options) {
		var defaults={
			source:0,
			url:"",
			title:"ELCID Person Search",
			mapFields:{}
		};
		var settings=$.extend(defaults,options||{});
		return this.each(function() {
			var $eps="";
			$(this).click(function() {
				if($("#ELCIDPersonSearchListDialog").length==0){
					var $dlg=$('<div id="ELCIDPersonSearchListDialog" style="display:block;" title="'+settings.title+'"></div>');
					var $dlg_tbl=$('<table class="primary" style="width:400px;margin:10px auto 10px auto;"><thead><tr><th colspan="7" class="ginablue">Search by the first letter of the last name</th></tr></thead></table>');
					var $dlg_tbl_tbody=$('<tbody><tr><td><input type="button" value="A-D"></td><td><input type="button" value="E-H"></td><td><input type="button" value="I-L"></td><td><input type="button" value="M-P"></td><td><input type="button" value="Q-T"></td><td><input type="button" value="U-Z"></td><td><input type="button" value="ALL"></td></tr><tr><td colspan="7">People Found:&nbsp;<span style="font-weight:bold;" id="eps_16789_span">0</span></td></tr><tr><td colspan="7"></td></tr></tbody>');
					var $dlg_tbl_tbody_select=$('<div id="eps_div"><select id="eps_1678912" name="eps_1678912" data-placeholder="Click one of the above buttons..."></select></div><div id="LDAPSearchLoading"></div>');
					$("tr:eq(2) td",$dlg_tbl_tbody).append($dlg_tbl_tbody_select);
					$("input:button",$dlg_tbl_tbody).click(function(){
						var sletter='',eletter='';letter='';btn_val=$(this).val();
						if(btn_val=='ALL'){sletter='A';eletter='Z';}
						else{
							letter=btn_val.split('-');
							sletter=letter[0];
							eletter=letter[1];
						}
						$.ajax({
							type: 'POST',
							url: '/includes/ajax/ELCIDPerson.php',
							data: 'token='+$.cookie('PHPSESSID')+'&source='+settings.source+'&sletter='+sletter+'&eletter='+eletter,
							beforeSend :function(){
								$('#LDAPSearchLoading').show();
								$("#eps_div").hide();
							},
							success: function(data){
								$('#LDAPSearchLoading').hide();
								$eps=$("select#eps_1678912");
								$eps.html("");
								i=0;
								$(data['results']).each(function(k,v){
									$eps.append('<option value="'+v['pkey']+'" data-dept="'+Base64.encode(v['orgName'])+'" data-name="'+Base64.encode(v['lname']+', '+v['fname'])+'">'+v['lname']+', '+v['fname']+' &lt;'+v['orgName']+'&gt;</option>');
									i++;
								});
								$("#eps_16789_span").html(i);
								$eps.trigger("chosen:updated");
								$("#eps_div").show();

							},
							dataType:'json'
						});
					}).css({"font-size":"14px","margin":"10px 5px"});
					$dlg_tbl.append($dlg_tbl_tbody);
					$dlg.append($dlg_tbl);
					$dlg.append('<div style="width:450px;margin:10px auto;font-size:13px;">If you cannot find the person you are looking for, then this person must be added to ELCID.</div>');
					$("body").append($dlg);
					$eps=$("select#eps_1678912");
					if (!jQuery().chosen){
						$.getScript( '/includes/chosen/chosen.jquery.min.js').done(function(){
							$("head").append('<link rel="stylesheet" href="/includes/chosen/chosen.css" type="text/css">');
							setTimeout(function(){$eps.chosen({"width":"95%"});},50);
						});
					}
					else{setTimeout(function(){$eps.chosen({"width":"95%"});},50);}
				}
				$epsd=$("#ELCIDPersonSearchListDialog");
				$epsd.dialog({
					width: 550,
					height: 535,
					buttons: {
						"Select": function() {
							if($eps.val()==""||$eps.val()==null){alertDialog('You must select a person');}
							else{
								if(settings.url==0){
									$tbl=$("table#"+settings.mapFields[0]+" tbody");
									$("tr.blankLine").remove();
									$tbl.append('<tr data-authoree="'+$eps.val()+'"><td><a class="sprite_delete spriteLink"></a></td><td style="padding:'+settings.mapFields[1]+'">'+Base64.decode($('option:selected',$eps).data("name"))+'</td><td style="padding:'+settings.mapFields[1]+'">'+Base64.decode($('option:selected',$eps).data("dept"))+'</td></tr>');
									$epsd.dialog('close');
								}
								else{window.location=settings.url.replace("###",$eps.val());}
							}
						},
						Cancel: function(){$epsd.dialog('close');}
					}
				});
			});
		});
	};

	jQuery.fn.LDAPSearch=function(options) {
		var defaults={
			source:0,
			'title':'RU Person Search',
			mapFields:{}
		};
		var settings=$.extend(defaults,options||{});
		return this.each(function() {
			$(this).click(function() {
				if($("#LDAPSearchDialog").length==0){$("body").append('<div id="LDAPSearchDialog" style="display:none;" title="'+settings.title+'"><table class="primary" style="width:400px;margin:0px auto 10px auto;"><tr><th colspan="2">Search Criteria</th></tr><tr><td align="right">First Name</td><td align="left"><input type="text" name="fname_LDAPSearch" id="fname_LDAPSearch" size="35" value=""></td></tr><tr><td align="right">Last Name</td><td align="left"><input type="text" name="lname_LDAPSearch" id="lname_LDAPSearch" size="35" value=""></td></tr><tr><td colspan="2" style="font-style:italic;color:#00F;">Click on the person\'s name in the "Results" box to select that person after you submit a search</td></tr></table><div id="LDAPSearchLoading"></div><table id="LDAPSearchResults" class="primary_highlight" style="width:auto;margin:0px auto 10px auto;"><thead><tr><th colspan="2">Results</th></tr><tr><td class="sub_header">Name</td><td class="sub_header">Dept</td></tr></thead><tbody><tr class="blankLine"><td colspan="2">&nbsp;</td></tr></tbody></table></div>');}
				$('#LDAPSearchDialog').dialog({
					width: 600,
					modal: true,
					buttons: {
						Submit: function() {
							var ldapFields="";
							$.each(settings.mapFields,function(i,v){
								ldapFields+=v+",";
							});
							$.ajax({
								type: 'POST',
								url: '/includes/ajax/LDAPSearch.php',
								data: 'token='+$.cookie('PHPSESSID')+'&source='+settings.source+'&fname='+Base64.encode($('#fname_LDAPSearch').val())+'&lname='+Base64.encode($('#lname_LDAPSearch').val())+'&ldapFields='+ldapFields,
								beforeSend :function(){
									$('#LDAPSearchLoading').show();
									$('#LDAPSearchResults').hide();
								},
								success: function(data){
									$('#LDAPSearchLoading').hide();
									$('#LDAPSearchResults').show();
									var $table=$('table#LDAPSearchResults tbody');
									if(data['errmsg']==''){
										$table.html('');
										var $tr='';
										$(data['results']).each(function(key,lf){
											$tr=$('<tr><td style="padding-right:10px;text-align:left;">'+lf['sn']+', '+lf['givenname']+'</td><td style="text-align:left;">'+lf['rulinkrutgersedustaffdepartment']+'</td></tr>').click(function() {
												$.each(settings.mapFields,function(i,v){
													if(v=="postaladdress"){lf[v]=lf[v].replace(/\$/g,"\r\n");}
													switch($('#'+i).prop('type')){
														case 'text':
														case 'hidden':
														case 'textarea':
														case 'select-one':
															$('#'+i).val(lf[v]);
														break;
														default:
															$('#'+i).html(lf[v]);
														break;
													}
												});
												$('#fname_LDAPSearch').val('');
												$('#lname_LDAPSearch').val('');
												$('#LDAPSearchDialog').dialog('close');
											});
											$table.append($tr);
										});
									}
									else{$table.html('<tr><td colspan="2" style="font-style:italic;">'+data['errmsg']+'</td></tr>');}
								},
								dataType:'json'
							});
						},
						Cancel: function(){$(this).dialog('close');}
					}
				});
			});
		});
	};

	jQuery.fn.buildingSearch=function(arg) {
		$(this).click(function() {
			$('#buildingSearchDialog').dialog({
				width: 600,
				modal: true,
				buttons: {
					Submit: function() {
						$.ajax({
							type: 'POST',
							url: '/includes/ajax/buildingSearch.php',
							data: 'token='+$.cookie('PHPSESSID')+'&num='+$('#buildingSearchNumber').val()+'&name='+escape($('#buildingSearchName').val()),
							success: function(data){
								var $table=$('table#buildingSearchResults tbody');
								$table.html('');
								var $tr='';
								$(data['results']).each(function(key,val){
									$tr=$('<tr><td>'+val['build_num']+'</td><td style="padding-left:10px;padding-right:10px;">'+val['build_name']+'</td><td>'+val['campus']+'</td><td style="padding-left:10px;">'+val['StreetNo']+' '+val['StreetAdd']+'</td></tr>').click(function() {
										x=arg.split(':');
										max=x.length;
										for(i=0;i<max;i++)
										{
											y=x[i].split('=');
											switch(  $('#'+y[0]).prop('type')  )
											{
												case 'text':
													$('#'+y[0]).val(val[y[1]]);
												break;
												case 'hidden':
													$('#'+y[0]).val(val[y[1]]);
												break;
												default:
													$('#'+y[0]).html(val[y[1]]);
												break;

											}
										}
										$('#buildingSearchDialog').dialog('close');
									});
									$table.append($tr);
								});
							},
							dataType:'json'
						});
					},
					Cancel: function() {$(this).dialog('close');}
				}
			});
		});
	};

	jQuery.fn.showDatepicker=function(yr_range){
		if (typeof yr_range === 'undefined'){yr_range="-5:+5";}
		$(this).css('margin-right','4px');
		var ctl_name= $(this).attr('id').substring(0,$(this).attr('id').length-2);
		$(this).datepicker({
			showOn:'button',
			yearRange:yr_range,
			buttonImage: IMAGE_PATH+'calendar.jpg',
			buttonImageOnly: true,
			dateFormat: 'yy',
			altField: '#datepicker_hidden',
			altFormat: 'mm-dd',
    		changeMonth: true,
    		changeYear: true,
			onClose:function() {
				var dph=$('#datepicker_hidden').val();
				if(dph!=''){
					var x=dph.split('-');
					$('#'+ctl_name+'_m').val(x[0]);
					$('#'+ctl_name+'_d').val(x[1]);
				}
			}
		});
	}

	jQuery.fn.simpleSort=function(){
		var $table=this;
		return this.each(function(){
			$('td.sub_header a', $table).each(function(column) {
				var $header = $(this);
				findSortKey = function($cell){
					return $cell.find('.sort-key').text().toUpperCase()+ ' ' + $cell.text().toUpperCase();
				};
				$header.click(function() {
					var sortDirection = 1;
					if ($header.is('.sorted-asc')) {sortDirection = -1;}
					var rows = $table.find('tbody > tr').get();
					$.each(rows, function(index, row) {
						var $cell = $(row).children('td').eq(column);
						row.sortKey = findSortKey($cell);
					});
					rows.sort(function(a, b) {
						if (a.sortKey < b.sortKey) return -sortDirection;
						if (a.sortKey > b.sortKey) return sortDirection;
						return 0;
					});
					$.each(rows, function(index, row) {
						$table.children('tbody').append(row);
						row.sortKey = null;
					});
					$table.find('td.sub_header a').removeClass('sorted-asc').removeClass('sorted-desc');
					if(sortDirection == 1){$header.addClass('sorted-asc');}
					else {$header.addClass('sorted-desc');}
					$table.find('td').removeClass('sorted').filter(':nth-child(' + (column + 1) + ')').addClass('sorted');
				});
			});
		});
	}

	jQuery.fn.deleteBiosafetyLocation=function(options) {
		var defaults={
			'source':0,
			'pkey_source':0,
			'title':'Delete Location'
		};
		var settings=$.extend(defaults,options||{});
		return this.each(function() {
			$(this).click(function() {
				var pkey,$div,$bs,$obj;
				switch(settings.pkey_source){
					case 0:
						$obj=$(this).parent().parent();
						pkey=$obj.data("pkey");
					break;
				}
				if($("#deleteBiosafetyLocationDialog").length==0){
					$div=$('<div id="deleteBiosafetyLocationDialog" style="display:none;" title="'+settings.title+'"><table class="primary" style="margin:10px auto 10px auto;"><tr><th colspan="2">Location Links</th></tr><tr><td class="sub_header" style="padding-right:10px;">Program</td><td class="sub_header">Links</td></tr><tr><td style="padding-right:10px;">Biosafety:</td><td id="deleteBiosafetyLocationBio" style="font-weight:bold;"></td></tr></table><div style="width:75%;margin:0px auto;" id="deleteBiosafetyLocationMsg">Click "Submit" to delete location</div></div>');
					$("body").append($div);
				}
				$.ajax({
					type: 'POST',
					url: '/includes/ajax/biosafeyLocation.php',
					data: "token="+$.cookie("PHPSESSID")+"&mode=1&pkey="+pkey+"&source="+settings.source,
					success: function(data){
						var validDelete=1;
						$("#deleteBiosafetyLocationCB").prop("checked",false);
						if(data['errmsg']!=""){
							alertDialog(data['errmsg']);
							return false;
						}
						$('#deleteBiosafetyLocationDialog').dialog({
							width: 600,
							modal: true,
							buttons: {
								Submit:function(){
									$.ajax({
										type: 'POST',
										url: '/includes/ajax/biosafeyLocation.php',
										data: "token="+$.cookie("PHPSESSID")+"&mode=2&pkey="+pkey+"&source="+settings.source,
										success: function(data){
											if(data['errmsg']!=""){alertDialog(data['errmsg']);}
											else{
												$obj.remove();
												$('#deleteBiosafetyLocationDialog').dialog('close');
												alertDialog("Location Deleted");
											}
										},
										dataType: 'json'
									});

								},
								Cancel:function(){$(this).dialog('close');}
							}
						});
						if(data['results']['bio']==0){
							$("td#deleteBiosafetyLocationBio").html("0").css("color","#00F");
						}
						else{
							$bs=$("#deleteBiosafetyLocationDialog").parent().find(".ui-dialog-buttonset"),pc="";
							$(data['results']['bio']).each(function(i,v){
								pc+="Linked to protocol #"+v+"<br />";
							});
							$("td#deleteBiosafetyLocationBio").html(pc).css("color","#F00");
							validDelete=0;
							$("button:eq(0)",$bs).hide();
						}
						if(validDelete==1){$("#deleteBiosafetyLocationMsg").css("text-align","center").html("Click \"Submit\" to delete this location");}
						else{
							$("#deleteBiosafetyLocationMsg").css("text-align","left").html("This location is linked in other programs. These links must be removed before this location can be deleted.");
							$("button:eq(0)",$bs).hide();
						}
					},
					dataType: 'json'
				});

			});
		});
	}

	jQuery.fn.showShadowDiv=function(){
		var left=((parseFloat($(window).width()) - parseFloat($(this).width()))/2)-100;
		var top=((parseFloat($(window).height()) - parseFloat($(this).height()))/2)-100;
		$(this).css({'top':top+'px','left':left+'px','display':'block'});
		$(this).show();
		$(this).draggable();
	}

	$('#toggle_hermes_person_search').click(function(){
		$('#hermes_person_search').slideToggle('fast');
	});

	$('input.search_btn').click(function(){
		var ldap_fields='';
		var sFname=$('#hermes_fname_search').val();
		var sLname=$('#hermes_lname_search').val();
		var token=$('#ajax_token').val();
		var fields=$.parseJSON(unescape($('#hermes_person_search_fields').val()));
		var division=''
		$.each(fields,function(i,e){ldap_fields+=e.ldap+',';});
		ldap_fields=ldap_fields.substring(0,ldap_fields.length-1)+',ou';
		$.ajax({
			type:'POST',
			cache:false,
			url:'/includes/ajax/hermes.php?view=1',
			data:'fname='+escape(sFname)+'&lname='+escape(sLname)+'&ldap_fields='+ldap_fields+'&token='+token,
			beforeSend:function(){
				$('#hermes_person_search_loading').show();
				$('table.hermes_person_search_results tbody').html('');
			},
			success: function(data){
				$('#hermes_person_search_loading').hide();
				if(data.errmsg==undefined)
				{
					$('table.hermes_person_search_results tbody').html('');
					$(data).each(function(key,ldap_val){
						$table=$('table.hermes_person_search_results tbody');
						$table.append('<tr><td align="left">'+ldap_val.sn+', '+ldap_val.givenname+'</td><td align="left">'+ldap_val.ou+'</td></tr>');
						$row=$('tr:last',$table);
						$row.addClass('clickable').hover(function(){$(this).addClass('hover');},function() {$(this).removeClass('hover');});
						$row.click(function()
						{
							$.each(fields,function(i,e){
								if($('#'+e.form).attr('type')!=undefined)
								{
									switch($('#'+e.form).attr('type'))
									{
										case 'text':
											if(e.ldap=='ou'&&e.split==1)
											{
												division=ldap_val[e.ldap].split(':');
												ldap_val[e.ldap]=division[0];
											}
											if(e.merge==1)
											{
												ldap_val[e.ldap]=(ldap_val['sn']+', '+ldap_val['givenname']).toUpperCase();
											}
											$('#'+e.form).val(ldap_val[e.ldap]);
										break;
										case 'hidden':
											$('#'+e.form).val(ldap_val[e.ldap]);
										break;
										default:
											$('#'+e.form).html(ldap_val[e.ldap]);
										break;
									}
								}
							});
							$table.html('');
							$('#hermes_person_search').hide();
						});
					});
				}
				else{$('div.errmsg').html(data.errmsg).show();return false;}
			},
			dataType:'json'
		});
	});

	$('#elcid_location_search').change(function(){
		var building=$('option:selected',this).val();
		var token=$('#ajax_token').val();
		$.ajax({
			type:'POST',
			cache:false,
			url:'/includes/ajax/hermes.php?view=3',
			data:'token='+token+'&building='+building,
			beforeSend:function(){
				$('#elcid_location_search_loading').show();
			},
			success: function(data){
				$('#elcid_location_search_loading').hide();
				if(data.errmsg==undefined){
					$('#elcid_location_room_search').html('');
					$(data).each(function(key,room_val){
						$('#elcid_location_room_search').append('<option value="'+room_val.pkey+'">'+room_val.room+'</option>');
					});
				}
				else{$('div.errmsg').html(data.errmsg).show();return false;}
			},
			dataType:'json'
		});
	});

	$('#elcid_location_searchPDO').change(function(){
		var building=$('option:selected',this).val();
		$.ajax({
			type:'POST',
			cache:false,
			url:'/includes/ajax/ELCIDLocation.php',
			data:'building='+building,
			beforeSend:function(){
				$('#elcid_location_search_loading').show();
				$("select#elcid_location_room_search").hide();
			},
			success: function(data){
				$('#elcid_location_search_loading').hide();
				$("select#elcid_location_room_search").show();
				if(data.errmsg=="")
				{
					$('#elcid_location_room_search').html('');
					$(data["results"]).each(function(key,room_val){
						$('#elcid_location_room_search').append('<option value="'+room_val.pkey+'">'+room_val.room+'</option>');
					});
				}
				else{$('div.errmsg').html(data.errmsg).show();return false;}
			},
			dataType:'json'
		});
	});

	$('input.elcid_person_search_btn').click(function(){
		var letters=($(this).val());
		var token=$('#ajax_token').val();
		if(letters=='ALL'){sLetter='all';}
		else
		{
			var sLetter=letters.substr(0,1);
			var eLetter=letters.substr(2,1);
		}
		$.ajax({
			type:'POST',
			cache:false,
			url:'/includes/ajax/hermes.php?view=2',
			data:'sletter='+sLetter+'&eletter='+eLetter+'&token='+token,
			beforeSend:function(){
				$('#elcid_person_search_loading').show();
			},
			success: function(data){
				$('#elcid_person_search').html('');
				$('#elcid_person_search_loading').hide();
				$('#submit_table').show();
				if(data.errmsg==undefined)
				{
					$('#elcid_person_search_records').html(data.length);
					$('#elcid_person_search_instructions').show();
					$(data).each(function(key,val){
						$('#elcid_person_search').append('<option value="'+val['pkey']+'">'+val['lname']+', '+val['fname']+' &lt;'+val['dept']+'&gt;</option>');
					});
					$("#elcid_person_search").searchable();
				}
				else{$('div.errmsg').html(data.errmsg).show();return false;}
			},
			dataType:'json'
		});
	});

	$('input.elcid_index_btn').click(function(){
		window.location='index.php?letter='+$(this).val();
	});
});