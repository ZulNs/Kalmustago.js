/*
 * Kalmustago.js: Kalender Musim Tahunan Gorontalo
 * 
 * Didesain oleh ZulNs, @Gorontalo, Indonesia, 5 Mei 2017
 * Berdasarkan ide/catatan saudara Amirudin Dako
 */
'use strict';
function Kalmustago(isHijr,year,firstDay,theme){
	if(typeof HijriDate=='undefined')throw new Error('HijriDate() class required!');
	let	kmtg=typeof this=='object'?this:window,
	gdate=new Date(),
	hdate=new HijriDate(),
	dispDate,
	tzOffset=Date.parse('01 Jan 1970'),
	isInit=true,
	oldTheme,
	gridAni='zoom',
	isJinxed=false,
	eventMode=6,
	isLegendLowanga,
	isLegendTualangaSore,
	isLegendHulitaPobole,
	isLegendTualangaPagi,
	isLegendTauwa,
	isLegendTeduh,
	isLegendPancaroba,
	isLegendAnginTimur,
	isLegendAnginBarat,
	isLegendBolehKawin,
	isLegendDilarangKawin,
	isLegendBolehBangunRumah,
	isLegendDilarangBangunRumah,
	aboutElm,
	aboutTitleElm,
	aboutDateElm,
	aboutCloseBtnElm,
	createElm=function(tagName,className,innerHTML){
		let el=document.createElement(tagName);
		if(className)el.className=className;
		if(innerHTML)el.innerHTML=innerHTML;
		return el
	},
	addEvt=function(el,ev,cb){
		if(window.addEventListener)el.addEventListener(ev,cb);
		else if(el.attachEvent)el.attachEvent('on'+ev,cb);
		else el['on'+ev]=cb
	},
	kmtgElm=createElm('div','zulns-kalmustago'),
	todayElm=createElm('div','w3-medium w3-margin-left w3-show-inline-block'),
	yearlyElm=createElm('div'),
	legendElm=createElm('div','w3-margin-left w3-margin-top w3-small'),
	createStyle=function(){
		let stl=document.getElementById('ZulNsKalmustagoStyle'),
			dt=Kalmustago.themes,
			dtl=dt.length;
		if(stl)return false;
		let str='svg{stroke:currentColor;fill:currentColor;stroke-width:1}'+
			'.w3-button{background-color:transparent}'+
			'.zulns-kalmustago .w3-button{padding:0px 8px}'+
			'.zulns-kalmustago .w3-cell{width:14.2857%;padding:2px 0px}'+
			'.styled{box-shadow: 0 1px 4px rgba(0,0,0,.8);border-radius:4px}';
		stl=createElm('style',null,str);
		stl.id='ZulNsDatepickerStyle';
		stl.type='text/css';
		document.body.appendChild(stl);
		return true
	},
	createAboutModal=function(){
		aboutElm=document.getElementById('ZulNsAbout');
		if(aboutElm){
			aboutTitleElm=document.getElementById('ZulNsAboutTitle');
			aboutDateElm=document.getElementById('ZulNsAboutDate');
			aboutCloseBtnElm=document.getElementById('ZulNsAboutCloseButton');
			return false
		}
		aboutElm=createElm('div','w3-modal');
		let cont=createElm('div','w3-modal-content w3-card-4 w3-border w3-display w3-black w3-animate-zoom'),
			info=createElm('div','w3-display-middle w3-bar w3-center'),
			zulns=createElm('p',null,'<span class="w3-tag w3-jumbo w3-red">Z</span>&nbsp;<span class="w3-tag w3-jumbo w3-yellow">u</span>&nbsp;<span class="w3-tag w3-jumbo w3-blue">l</span>&nbsp;<span class="w3-tag w3-jumbo w3-green">N</span>&nbsp;<span class="w3-tag w3-jumbo w3-purple">s</span>');
		aboutCloseBtnElm=createElm('button','w3-button w3-ripple w3-display-topright','<svg width="18" height="19"><path d="M5 9L5 10L8 13L5 16L5 17L6 17L9 14L12 17L13 17L13 16L10 13L13 10L13 9L12 9L9 12L6 9Z"/></svg>');
		aboutTitleElm=createElm('p','w3-xlarge');aboutDateElm=createElm('p','w3-large');aboutElm.id='ZulNsAbout';
		aboutElm.style.display='none';aboutElm.setAttribute('callback',null);
		cont.style.cssText='width:440px;height:300px;cursor:default;';
		aboutCloseBtnElm.id='ZulNsAboutCloseButton';
		aboutTitleElm.id='ZulNsAboutTitle';
		aboutDateElm.id='ZulNsAboutDate';
		info.appendChild(aboutTitleElm);
		info.appendChild(zulns);
		info.appendChild(aboutDateElm);
		cont.appendChild(info);
		cont.appendChild(aboutCloseBtnElm);
		aboutElm.appendChild(cont);
		document.body.appendChild(aboutElm);
		addEvt(aboutCloseBtnElm,'click',function(){
			aboutElm.style.display='none';
			aboutTitleElm.innerHTML='';
			aboutDateElm.innerHTML='';
			if(typeof aboutElm.callback=='function')aboutElm.callback();
			aboutElm.callback=null
		});
		return true
	},
	createYearlyCal=function(){
		isLegendLowanga=false;
		isLegendTualangaSore=false;
		isLegendHulitaPobole=false;
		isLegendTualangaPagi=false;
		isLegendTauwa=false;
		isLegendTeduh=false;
		isLegendPancaroba=false;
		isLegendAnginTimur=false;
		isLegendAnginBarat=false;
		isLegendBolehKawin=false;
		isLegendDilarangKawin=false;
		isLegendBolehBangunRumah=false;
		isLegendDilarangBangunRumah=false;
		for(let i=0;i<12;i++){
			dispDate.setMonth(i);
			yearlyElm.appendChild(createMonthlyCal(dispDate.getMonthName()+' '+dispDate.getFullYear()));
		}
	},
	recreateYearlyCal=function(){
		while(yearlyElm.firstChild)yearlyElm.removeChild(yearlyElm.firstChild);
		while(legendElm.firstChild)legendElm.removeChild(legendElm.firstChild);
		createYearlyCal()
	},
	createMonthlyCal=function(title){
		let wrapElm=createElm('div','w3-card w3-margin-left w3-margin-top w3-show-inline-block'),
			headerElm=createElm('div','w3-'+theme),
			titleElm=createElm('span','w3-medium',title),
			wdayElm=createElm('div','w3-cell-row w3-center w3-small w3-light-grey'),
			gridsElm=createElm('div','w3-white w3-small'),
			prevBtnElm=createElm('button','w3-button w3-ripple w3-left','<svg width="18" height="19"><path d="M10 7L7 13L10 19L12 19L9 13L12 7Z"/></svg>'),
			nextBtnElm=createElm('button','w3-button w3-ripple w3-right','<svg width="18" height="19"><path d="M7 7L10 13L7 19L9 19L12 13L9 7Z"/></svg>');
		wrapElm.style.width='224px';
		headerElm.style.cssText='height:32px;line-height:32px;vertical-align:middle;text-align:center';
		titleElm.style.cssText='cursor:default;';
		wdayElm.style.cssText='padding:2px 2px;margin-bottom:2px;cursor:default;';
		headerElm.appendChild(titleElm);
		headerElm.appendChild(prevBtnElm);
		headerElm.appendChild(nextBtnElm);
		gridsElm.appendChild(wdayElm);
		wrapElm.appendChild(headerElm);
		wrapElm.appendChild(gridsElm);
		addEvt(prevBtnElm,'click',onDecYear);
		addEvt(nextBtnElm,'click',onIncYear);
		for(let i=firstDay;i<7+firstDay;i++){
			let day=createElm('div','w3-cell',dispDate.getWeekdayShortName(i));
			if(i%7==5)day.className+=' w3-text-teal';
			if(i%7==0)day.className+=' w3-text-red';
			wdayElm.appendChild(day)
		}
		createDates(gridsElm);
		return wrapElm
	},
	createDates=function(gridsElm){
		let dispTm=dispDate.getTime(),
			ppdr=dispDate.getDay()-firstDay;
		if(ppdr<0)ppdr+=7;
		let pcdr=dispDate.getDayCountInMonth(),
			pndr=(7-(ppdr+pcdr)%7)%7;
		dispDate.setDate(1-ppdr);
		syncDates();
		let pdate=dispDate.getDate(),
			sdate=getOppsDate().getDate(),
			pdim=dispDate.getDayCountInMonth(),
			sdim=getOppsDate().getDayCountInMonth(),
			isFri=(13-firstDay)%7,
			isSun=(8-firstDay)%7,
			gridCtr=0,
			ttc,
			isToday,
			gdt,
			hmonth=hdate.getMonth(),
			gmonth=gdate.getMonth(),
			phmonth=hmonth,
			desc,
			isStyled,
			isLowanga,
			isMusimTanam,
			isMusimKawin,
			isMusimBangunRumah;
		dispDate.setDate(1);
		getOppsDate().setDate(1);
		for(let i=1;i<=ppdr+pcdr+pndr;i++){
			if(gridCtr==0){
				var row=createElm('div','w3-cell-row');
				row.style.cssText='padding:0px 2px;margin-bottom:0px;';
				gridsElm.appendChild(row)
			}
			let grid=createElm('div','w3-cell w3-center w3-animate-'+gridAni,pdate),
				ttc=dispDate.getTime()+(pdate-1)*864e5;
			row.appendChild(grid);
			isToday=getCurTime()==ttc;
			if(i<=ppdr||ppdr+pcdr<i){
				if(i%7==isFri)grid.className+=' w3-text-teal';
				else if(i%7==isSun)grid.className+=' w3-text-red';
				grid.className+=' w3-disabled';
				grid.style.cursor='default'
			}else{
				isStyled=false;
				if(26586e6==ttc){
					grid.className+=' w3-black w3-btn w3-ripple';
					grid.style.cursor='pointer';
					addEvt(grid,'click',onAbout);
					isStyled=true;
					grid.title=String.fromCharCode(0x2a,0x2a,0x2a,0x20,0x5a,0x75,0x6c,0x4e,0x73,0x20,0x2a,0x2a,0x2a)
				}
				if(isJinxed){
					switch((i%7+firstDay)%7){
						case 1:isLowanga=(hmonth==0);break;
						case 2:isLowanga=(hmonth==10);break;
						case 3:isLowanga=(hmonth==3||hmonth==8);break;
						case 4:isLowanga=(hmonth==1||hmonth==11);break;
						case 5:isLowanga=(hmonth==4||hmonth==7);break;
						case 6:isLowanga=(hmonth==2||hmonth==6);break;
						case 0:isLowanga=(hmonth==5||hmonth==9)
					}
					if(isLowanga){
						desc='LOWANGA';
						if(isStyled)grid.title+=', '+desc;
						else{
							grid.className+=' w3-red';
							grid.title=desc;
							isStyled=true
						}
						if(!isLegendLowanga){
							createLegend('w3-pale-red w3-border-red',desc);
							isLegendLowanga=true
						}
					}
				}
				if(eventMode==0){ //musim-tanam
					gdt=isHijr?sdate:pdate;
					switch(gmonth){
						case 0:isMusimTanam=(gdt<=6||21<=gdt);break;
						case 1:isMusimTanam=(gdt<=8||21<=gdt);break;
						case 2:isMusimTanam=(gdt<=14||21<=gdt);break;
						case 3:isMusimTanam=(gdt<=6||21<=gdt);break;
						case 4:isMusimTanam=(gdt<=8||23<=gdt);break;
						case 5:isMusimTanam=(gdt<=14||23<=gdt);break;
						case 6:isMusimTanam=(gdt<=6||23<=gdt);break;
						case 7:isMusimTanam=(gdt<=8||23<=gdt);break;
						case 8:isMusimTanam=(gdt<=14||21<=gdt);break;
						case 9:isMusimTanam=(gdt<=16||21<=gdt);break;
						case 10:isMusimTanam=(gdt<=8||21<=gdt);break;
						case 11:isMusimTanam=(gdt<=14||23<=gdt)
					}
					if(isMusimTanam){
						if(gmonth==11&&gdt>=30||gmonth<2||gmonth==2&&gdt<=29){
							desc = 'Periode Rendengan, Tualanga Sore';
							if(!isStyled){
								grid.className+=' w3-green';
								if(!isLegendTualangaSore){
									createLegend('w3-pale-green w3-border-green',desc);
									isLegendTualangaSore=true
								}
							}
						}
						else if(gmonth<5||gmonth==5&&gdt<=29){
							desc = 'Periode Gadu, Hulita/Pobole';
							if(!isStyled){
								grid.className+=' w3-brown';
								if(!isLegendHulitaPobole){
									createLegend('w3-sand w3-border-brown',desc);
									isLegendHulitaPobole=true
								}
							}
						}
						else if(gmonth<9||gmonth==9&&gdt<=3){
							desc = 'Periode Gadu, Tualanga Pagi';
							if(!isStyled){
								grid.className+=' w3-amber';
								if(!isLegendTualangaPagi){
									createLegend('w3-pale-yellow w3-border-amber',desc);
									isLegendTualangaPagi=true
								}
							}
						}
						else{
							desc = 'Periode Rendengan, Tauwa';
							if(!isStyled){
								grid.className+=' w3-blue';
								if(!isLegendTauwa){
									createLegend('w3-pale-blue w3-border-blue',desc);
									isLegendTauwa=true
								}
							}
						}
						if(isStyled)grid.title+=', '+desc;
						else{
							grid.title=desc;
							isStyled = true
						}
					}
				}else if(eventMode==1){ //musim-melaut
					switch(gmonth){
						case 0:case 1:case 2:
							desc = 'Musim Teduh';
							if(!isStyled){
								grid.className+=' w3-green';
								if (!isLegendTeduh) {
									createLegend('w3-pale-green w3-border-green',desc);
									isLegendTeduh=true
								}
							}
							break;
						case 3:case 4:
							desc='Musim Pancaroba';
							if(!isStyled){
								grid.className+=' w3-brown';
								if (!isLegendPancaroba) {
									createLegend('w3-sand w3-border-brown',desc);
									isLegendPancaroba=true
								}
							}
							break;
						case 5:case 6:case 7:case 8:
							desc='Musim Angin Timur';
							if(!isStyled){
								grid.className+=' w3-amber';
								if (!isLegendAnginTimur) {
									createLegend('w3-pale-yellow w3-border-amber',desc);
									isLegendAnginTimur=true
								}
							}
							break;
						case 9:case 10:case 11:
							desc='Musim Angin Barat';
							if(!isStyled){
								grid.className+=' w3-blue';
								if (!isLegendAnginBarat) {
									createLegend('w3-pale-blue w3-border-blue',desc);
									isLegendAnginBarat=true
								}
							}
					}
					if(isStyled)grid.title+=', '+desc;
					else{
						grid.title=desc;
						isStyled = true
					}
				}else if(eventMode==2){ //musim-hajatan
					isMusimKawin=false;
					switch(hmonth){
						case 0:desc='Tiada mufakat, mati segera';break;
						case 1:desc='Afiat baik';isMusimKawin=true;break;
						case 2:desc='Segera bercerai (mati)';break;
						case 3:desc='Berkelahi';break;
						case 4:desc='Dukacita kemudian cerai';break;
						case 5:desc='Mendapat harta';isMusimKawin=true;break;
						case 6:desc='Mendapat anak';isMusimKawin=true;break;
						case 7:desc='Amat baik dan nikmat';isMusimKawin=true;break;
						case 8:desc="Dapat anak durhaka pada Allah Ta'ala";break;
						case 9:desc='Papa';break;
						case 10:desc='Kesakitan';break;
						case 11:desc='Amat baik dan baik segera yang dibuat';isMusimKawin=true
					}
					if(phmonth!= hmonth){
						isLegendBolehKawin=false;
						isLegendDilarangKawin=false;
						phmonth=hmonth
					}
					if(isMusimKawin){
						if(!isStyled){
							grid.className+=' w3-green';
							if(!isLegendBolehKawin){
								createLegend('w3-pale-green w3-border-green',(isHijr?'Bulan '+hdate.getMonthName()+': ':'Mulai '+pdate+' '+gdate.getMonthName()+': ')+desc);
								isLegendBolehKawin=true
							}
						}
					}else{
						if(!isStyled){
							grid.className+=' w3-amber';
							if (!isLegendDilarangKawin) {
								createLegend('w3-pale-yellow w3-border-amber',(isHijr?'Bulan '+hdate.getMonthName()+': ':'Mulai '+pdate+' '+gdate.getMonthName()+': ')+desc);
								isLegendDilarangKawin=true
							}
						}
					}
					if(isStyled)grid.title+=', '+desc;
					else{
						grid.title=desc;
						isStyled = true
					}
				}
				else if(eventMode==3){ //payango-bele
					isMusimBangunRumah=false;
					switch(hmonth){
						case 0:desc='Banyak huru-hara';break;
						case 1:desc='Mulia, baik, beroleh nikmat, tiada putus asa, rejeki';isMusimBangunRumah=true;break;
						case 2:desc='Kesukaran, tidak beroleh rejeki, kematian';break;
						case 3:desc='Maha baik, sentosa, sukacita';isMusimBangunRumah=true;break;
						case 4:desc='Maha baik, beroleh rejeki, sejuk';isMusimBangunRumah=true;break;
						case 5:desc='Terlalu jahat, perkelahian, berbantah-bantahan';break;
						case 6:desc='Terlalu jahat, bertikam, berkelahi, kehilangan';break;
						case 7:desc='Maha baik, beroleh rejeki, harta, emas dan perak';isMusimBangunRumah=true;break;
						case 8:desc="Maha baik, beroleh harta, emas dan perak";isMusimBangunRumah=true;break;
						case 9:desc='Jahat, terbakar, kehilangan';break;
						case 10:desc='Sekalian orang kasihan';break;
						case 11:desc='Amat baik, beroleh harta dan hamba sahaya';isMusimBangunRumah=true
					}
					if(phmonth!=hmonth){
						isLegendBolehBangunRumah=false;
						isLegendDilarangBangunRumah=false;
						phmonth=hmonth
					}
					if(isMusimBangunRumah){
						if(!isStyled){
							grid.className+=' w3-green';
							if(!isLegendBolehBangunRumah){
								createLegend('w3-pale-green w3-border-green',(isHijr?'Bulan '+hdate.getMonthName()+': ':'Mulai '+pdate+' '+gdate.getMonthName()+': ')+desc);
								isLegendBolehBangunRumah=true
							}
						}
					}else{
						if(!isStyled){
							grid.className+=' w3-amber';
							if(!isLegendDilarangBangunRumah){
								createLegend('w3-pale-yellow w3-border-amber',(isHijr?'Bulan '+hdate.getMonthName()+': ':'Mulai '+pdate+' '+gdate.getMonthName()+': ')+desc);
								isLegendDilarangBangunRumah=true
							}
						}
					}
					if(isStyled)grid.title+=', '+desc;
					else{
						grid.title=desc;
						isStyled = true
					}
				}
				if(isToday){
					desc='Hari ini';
					if(isStyled)grid.title+=', '+desc;
					else{
						grid.className+=' w3-dark-grey';
						grid.title=desc;
						isStyled=true
					}
				}
				else if(!isStyled&&i%7==isFri)grid.className+=' w3-text-teal';
				else if(!isStyled&&i%7==isSun)grid.className+=' w3-text-red';
				if(isStyled)grid.className+=' styled'
			}
			pdate++;
			if(pdate>pdim){
				pdate=1;
				dispDate.setMonth(dispDate.getMonth()+1);
				pdim=dispDate.getDayCountInMonth();
				if(isHijr)hmonth=hdate.getMonth();
				else gmonth=gdate.getMonth()
			}
			sdate++;
			if(sdate>sdim){
				sdate=1;
				getOppsDate().setMonth(getOppsDate().getMonth()+1);
				sdim=getOppsDate().getDayCountInMonth();
				if(isHijr)gmonth=gdate.getMonth();
				else hmonth=hdate.getMonth()
			}
			gridCtr=++gridCtr%7			
		}
		var row=createElm('div');
		row.style.marginTop='2px';
		gridsElm.appendChild(row);
		dispDate.setTime(dispTm)
	},
	createLegend=function(color,desc){
		let el=createElm('div','w3-panel w3-leftbar '+color,desc);
		legendElm.appendChild(el)
	},
	onDecYear=function(){
		dispDate.setFullYear(dispDate.getFullYear()-1);
		gridAni='right';
		recreateYearlyCal();
	},
	onIncYear=function(){
		dispDate.setFullYear(dispDate.getFullYear()+1);
		gridAni='left';
		recreateYearlyCal();
	},
	onAbout=function(){
		aboutTitleElm.innerHTML='KalMus&nbsp;Tahunan&nbsp;Gorontalo';
		aboutDateElm.innerHTML='Gorontalo,&nbsp;2&nbsp;Mei&nbsp;2019';
		aboutElm.style.display='block'
	},
	getOppsDate=function(){
		return isHijr?gdate:hdate
	},
	getFixTime=function(time){
		time-=tzOffset;
		return time-time%864e5+36e5+tzOffset
	},
	getCurTime=function(){
		return getFixTime(Date.now())
	},
	beginNewDate=function(){
		let n=Date.now()-tzOffset,
			t=864e5-n%864e5;
		window.setTimeout(beginNewDate,t);
		updTodayStr();
		if(isInit){
			todayElm.className+=' w3-'+theme;
			isInit=false
		}else{
			newTheme();
			updTheme()
		}
	},
	updTodayStr=function(){
		let oldTm=dispDate.getTime();
		dispDate.setTime(getCurTime());
		todayElm.innerHTML=dispDate.todayString();
		dispDate.setTime(oldTm)
	},
	syncDates=function(){
		getOppsDate().setTime(dispDate.getTime());
	},
	newTheme=function(){
		let dt=Kalmustago.themes,i;
		oldTheme=theme;
		do i=Math.floor(Math.random()*dt.length);
		while(dt[i]==theme);
		theme=dt[i]
	},
	setNewTheme=function(t){
		let dt=Kalmustago.themes,
			dtl=dt.length,
			i=0;
		if(typeof t=='number'){
			if(0<=t&&t<dtl){
				oldTheme=theme;
				theme=dt[t]
			}else newTheme()
		}else if(typeof t=='string'){
			t=t.toLowerCase();
			for(;i<dtl;i++)if(dt[i]==t)break;
			if(i<dtl){
				oldTheme=theme;
				theme=dt[i]
			}else newTheme()
		}else newTheme()
	},
	updTheme=function(){
		todayElm.className=todayElm.className.replace('w3-'+oldTheme,'w3-'+theme);
		recreateYearlyCal()
	};
	kmtg.about=function(){
		onAbout()
	};
	kmtg.attachTo=function(el){
		if(el.appendChild&&!kmtgElm.parentNode)el.appendChild(kmtgElm)
	};
	kmtg.getElement=function(){
		return kmtgElm
	};
	kmtg.setFirstDayOfWeek=function(f){
		f=HijriDate.int(f,firstDay)%7;
		if(f!=firstDay){
			firstDay=f;
			recreateYearlyCal();
		}
	};
	kmtg.setFullYear=function(y){
		let cy=dispDate.getFullYear();
		y=HijriDate.int(y,cy);
		if(y!=cy){
			dispDate.setFullYear(y);
			recreateYearlyCal()
		}
	};
	kmtg.setHijriMode=function(h){
		if(typeof h=='boolean'&&h!=isHijr){
			dispDate.setMonth(6);
			syncDates();
			dispDate=getOppsDate();
			dispDate.setDate(1);
			isHijr=h;
			updTodayStr();
			recreateYearlyCal()
		}
	};
	kmtg.setTheme=function(t){
		setNewTheme(t);
		updTheme()
	};
	kmtg.today=function(){
		let cy=dispDate.getFullYear();
		dispDate.setTime(getCurTime());
		dispDate.setDate(1);
		if(cy!=dispDate.getFullYear())recreateYearlyCal();
	};
	kmtg.showJinxed=function(){
		if(!isJinxed){
			isJinxed=true;
			recreateYearlyCal()
		}
	};
	kmtg.hideJinxed=function(){
		if(isJinxed){
			isJinxed=false;
			recreateYearlyCal()
		}
	};
	kmtg.showEvent=function(ev){
		ev=parseInt(ev);
		if(0<=ev&&ev<=3&&ev!=eventMode){
			eventMode=ev;
			recreateYearlyCal()
		}
	};
	kmtg.hideEvent=function(){
		if(0<=eventMode&&eventMode<=3){
			eventMode=6;
			recreateYearlyCal()
		}
	}
	if(typeof isHijr!='boolean')isHijr=false;
	dispDate=isHijr?hdate:gdate;
	year=HijriDate.int(year,NaN);
	if(!isNaN(year)){
		dispDate.setTime(getFixTime(year));
		dispDate.setDate(1)
	}else{
		dispDate.setTime(getCurTime());
		dispDate.setDate(1)
		if(!isNaN(year))dispDate.setFullYear(year)
	}
	firstDay=HijriDate.int(firstDay,1)%7;
	setNewTheme(theme);
	beginNewDate();
	createStyle();
	createAboutModal();
	todayElm.style.cssText='padding:4px 8px';
	kmtgElm.appendChild(todayElm);
	kmtgElm.appendChild(yearlyElm);
	kmtgElm.appendChild(legendElm);
	let el=createElm('div');
	el.style.marginTop='16px';
	kmtgElm.appendChild(el);
	updTheme()
}
Date.prototype.getDateString=function(){
	return this.getWeekdayName()+', '+this.getDate()+' '+this.getMonthName()+' '+this.getYearString()
};
Date.prototype.getMonthName=function(m){
	m=(HijriDate.int(m,this.getMonth())%12+12)%12;
	return Kalmustago.strings['monthNames'][m]
};
Date.prototype.getWeekdayName=function(d){
	d=(HijriDate.int(d,this.getDay())%7+7)%7;
	return Kalmustago.strings['weekdayNames'][d]
};
Date.prototype.getWeekdayShortName=function(d){
	d=(HijriDate.int(d,this.getDay())%7+7)%7;
	return Kalmustago.strings['weekdayShortNames'][d]
};
Date.prototype.getYearString=function(y){
	y=HijriDate.int(y,this.getFullYear());
	let i=0;
	if(y<1){i++;y=1-y}
	return y+' '+Kalmustago.strings['eraSuffix'][i]
};
Date.prototype.todayString=function(){
	let t=this.getTime();this.setTime(Date.now());
	let	s=this.getWeekdayName()+', '+this.getDate()+' '+this.getMonthName()+' '+this.getFullYear();
	this.setTime(t);return s
};
HijriDate.prototype.getDateString=function(){
	return this.getWeekdayName()+', '+this.getDate()+' '+this.getMonthName()+' '+this.getYearString()
};
HijriDate.prototype.getMonthName=function(m){
	m=(HijriDate.int(m,this.getMonth())%12+12)%12;
	return Kalmustago.strings['hMonthNames'][m]
};
HijriDate.prototype.getWeekdayName=function(d){
	d=(HijriDate.int(d,this.getDay())%7+7)%7;
	return Kalmustago.strings['weekdayNames'][d]
};
HijriDate.prototype.getWeekdayShortName=function(d){
	d=(HijriDate.int(d,this.getDay())%7+7)%7;
	return Kalmustago.strings['weekdayShortNames'][d]
};
HijriDate.prototype.getYearString=function(y){
	y=HijriDate.int(y,this.getFullYear());
	let i=0;
	if(y<1){i++;y=1-y}
	return y+' '+Kalmustago.strings['hEraSuffix'][i]
};
HijriDate.prototype.todayString=function(){
	let t=this.getTime();this.setTime(Date.now());
	let	s=this.getWeekdayName()+', '+this.getDate()+' '+this.getMonthName()+' '+this.getFullYear();
	this.setTime(t);return s
};
Object.defineProperty(Kalmustago,'themes',{value:['amber','aqua','black','blue','blue-grey','brown','cyan','dark-grey','deep-orange','deep-purple','green','grey','indigo','khaki','light-blue','light-green','lime','orange','pink','purple','red','teal','yellow']});
Kalmustago.strings={
	eraSuffix:["M","SM"],
	hEraSuffix:["H","SH"],
	weekdayNames:["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"],
	weekdayShortNames:["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
	monthNames:["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
	hMonthNames:["Muharam","Safar","Rabi'ul-Awal","Rabi'ul-Akhir","Jumadil-Awal","Jumadil-Akhir","Rajab","Sya'ban","Ramadhan","Syawwal","Zulqa'idah","Zulhijjah"]
};
