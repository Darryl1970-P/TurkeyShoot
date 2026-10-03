

	var inter;
	var Sprite = {};
	var SpriteCount = 0;
	var debug = 2;
	var ang = 0; //30 for ghost
	var btnReset = false;
	var btnResetTitle = "Revive";
	var angle = 0;
	var opacityVal = 1;
	var maxNbr = 5;
	var spriteWidth = "200px";
	var mult = 1;
	
	function SpriteObj(id, x, y, hDir, vDir, imgAlive, imgDead, angle) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.hDir = hDir;
		this.vDir = vDir;
		this.imgAlive = imgAlive;
		this.imgDead = imgDead;
		this.angle = angle;
	}
	
	onload = function() {	
	//alert('here');
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		if (mm === 10 && dd === 31 || debug === 1) {
			//Halloween
			angle = 30;
			opacityVal = .8;
			maxNbr = 3;
			CreateAnimation("Ghost.gif", "Ghost.gif");
			inter = setInterval("Animation()", 60);
		}	else if (mm === 11 && dd >= 19 && dd <= 23 || debug === 2) {
			//Thanksgiving
			mult = 2;
			CreateAnimation("Turkey.gif", "TurkeyCooked.png");
			btnResetTitle = "Zombie Turkeys";
			inter = setInterval("Animation()", 60);
		} else if (mm === 12 && dd>=19 && dd <= 25 || debug === 3) {
			//Happy Holiday
			mult = 1;
			maxNbr = 5;
			angle = 45;
			btnResetTitle = "Psychedelic Wreaths";
			CreateAnimation("Wreath.gif", "Wreath2.gif");
			inter = setInterval("Animation()", 60);		
		} else if (mm === 12 && dd>=30 || mm === 1 && dd <= 2 || debug === 4) {
			//New Years
			mult = 1;
			maxNbr = 5;
			angle = 45;
			btnResetTitle = "Melted Snowmen";
			CreateAnimation("Snowman_Nod.gif", "Snowman_Melt.png");
			inter = setInterval("Animation()", 60);		
		}
	}
	
	function CreateBtnReset() {
		var btn = document.createElement("button");
		btn.className = "btnReset";
		btn.innerHTML = btnResetTitle;
		document.body.appendChild(btn);
		btnReset = true;
		$(btn).click(function() { Reset();});
	}
	
	function CreateAnimation(imgSrcAlive, imgSrcDead) {
			SpriteCount++
			wid=document.documentElement.clientWidth;
			hei=document.documentElement.clientHeight;
			var newImg = document.createElement('img');
			newImg.src = "images/" + imgSrcAlive;
			newImg.alt = imgSrcAlive;
			newImg.className = "ani";
			newImg.style.width = spriteWidth;
			newImg.style.left = "-400px";
			newImg.id = "Sprite" + SpriteCount;
			newImg.style.opacity = opacityVal;
			
			var x = Math.round(Math.random() * wid);
			var dx = 8 * mult;
			if (x > wid/2) {
				x = (wid - 210);
				dx = - 8 * mult;
			} else {
				x = 0;
			}
			
			var y = Math.round(Math.random() * hei);
			var dy = 5 * mult;
			if (y > hei/2) {
				dy=-5 * mult;
			}
			
			
			Sprite[SpriteCount] = new SpriteObj(newImg.id, x, y, dx, dy, imgSrcAlive, imgSrcDead, angle);
			
			document.body.appendChild(newImg);
			if (btnResetTitle !== "") {			
				$(newImg).click(function(){StopAnimation(this, imgSrcDead);});
			}
			
	}
		
	function Animation() {
		var count = 0;
		var aliveCount = 0;
		$('.ani').each(
			function() {
				count++;
				if (!$(this).hasClass('isDead')) {
					wid=document.documentElement.clientWidth;
					hei=document.documentElement.clientHeight;
					gWi = $('#Sprite'+count).width() + Math.abs(Sprite[count].hDir) * 5;
					gHi = $('#Sprite'+count).height() + Math.abs(Sprite[count].vDir) * 5;
					
					Sprite[count].x = Sprite[count].x + Sprite[count].hDir;
					if (Sprite[count].x >= wid - gWi ) {
						Sprite[count].x = wid - gWi;
						Sprite[count].hDir = 10 + Math.random() * 8;
						Sprite[count].hDir =- Math.abs(Sprite[count].hDir);
						Sprite[count].angle = -ang;
					}
					if (Sprite[count].x <= 0) {
						Sprite[count].x = 0;
						Sprite[count].hDir = 10 + Math.random() * 8;
						Sprite[count].hDir = Math.abs(Sprite[count].hDir);
						Sprite[count].angle = ang;
					}
					
					Sprite[count].y = Sprite[count].y + Sprite[count].vDir;
					if (Sprite[count].y >= hei - gHi) {
						Sprite[count].y = hei - gHi;
						Sprite[count].vDir = 2 + Math.random() * 16;
						Sprite[count].vDir =- Math.abs(Sprite[count].vDir);
					}
					if (Sprite[count].y <= 0) {
						Sprite[count].y = 0;
						Sprite[count].vDir = 2 + Math.random() * 16;
						Sprite[count].vDir = Math.abs(Sprite[count].vDir);
					}
					
					var id = "#" + Sprite[count].id;
					var rot = "";
					if (angle !== 0) {
						rot = "rotate(" + Sprite[count].hDir + "deg)";
					}
					var flip = "";
					if (Sprite[count].hDir < 0 && angle == 0) {
						flip = "scaleX(-1)";
					} else if (angle == 0 && Sprite[count].hDir > 0) {
						flip = "scaleX(1)";
					}
					
					var trans = rot + " " + flip;
					
					$(id).css({
						left: Sprite[count].x + "px",
						top: Sprite[count].y + "px",
						transform: trans
					});
					
					aliveCount++;
				}
				
		});
		if (aliveCount < maxNbr && Math.random() * 1000 < 100) {
			CreateAnimation(Sprite[SpriteCount].imgAlive, Sprite[SpriteCount].imgDead, opacityVal);
			if (btnReset === false && $('.isDead').length > 10) {
				CreateBtnReset();
			}
		}
	}
	
	function Reset() {
		$('.btnReset').remove();
		btnReset = false;
		$('.isDead').fadeIn(1000, function() {
			$('.isDead').removeClass('isDead');
		});
	}
	
	function StopAnimation(sender, imgSrcDead) {
		if ($(sender).hasClass("isDead") === false) {
			$(sender).addClass('isDead');
			imgSrcDead = "images/" + imgSrcDead;
			$(sender).attr("src", imgSrcDead).fadeOut(1000);
		}
	}
