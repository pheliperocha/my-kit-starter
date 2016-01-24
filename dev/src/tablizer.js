(function ( $ ) {

$.fn.tablizer = function(options) {
	var _tablizerTable = this;
	
	$letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","X","W","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO"];	
	
	$userClass = this.attr("class");
	$userStyle = this.attr("style");
	this.attr("class","tablizer");
	this.attr("style"," ");
	
	// Opções default
	var defaults = {
		letterHead: true, // Com o cabeçalho de Letras 
		numberCount: true, // Com o cabeçalho numérico 
		freezeCol: true, // Congelar coluna
		freezeRow: true, // Congelar linha
		width: "100%", // Largura total
		height: "100%" // Altura total
	}
	
	options = $.extend(defaults, options);
	
	if (parseInt(options.height) > $(this).height()+20) {
		options.height = $(this).height()+30;
	}
	
	$numCols = this.find("tr:first-child").find("td").length; // Número de colunas
	$numRows = this.find("tr").length; // Número de linhas
	
	if (options.freezeCol) {
		this.before("<div class=\"tablizer-fixer-col\"></div>");
	}
	
	if (options.freezeRow) {
		this.before("<div class=\"tablizer-fixer-row\"></div>");
	}
	
	this.wrap("<div class=\"tablizer-content-fixed\">");
	
	this.parent().wrap("<div class=\"tablizer-general-content\">");
	this.parent().parent().attr("style",$userStyle); // Mantem os estilos definidos na tabela.
	
	if (options.letterHead) {
		$letteringCols = "<div class=\"tablizer-content-lettering\">";
		if (options.numberCount) {
			$letteringCols += "<div class=\"corner\">&nbsp;</div>";
		}
		for ($i = 0; $i < $numCols; $i++) {
			$letteringCols += "<div class=\"h-col-"+$letters[$i]+"\">"+$letters[$i]+"</div>";
		}
		$letteringCols += "</div>";
		
		this.parent().before($letteringCols);
	}
	
	if (options.numberCount) {
		$numberingRows = "<div class=\"tablizer-content-numbering\">";
		for ($i = 1; $i <= $numRows; $i++) {
			$numberingRows += "<div class=\"h-row-"+$i+"\">"+$i+"</div>";
		}
		$numberingRows += "</div>";
		
		this.parent().before($numberingRows);
	}
	
	this.find("tr").each(function(count) {
		$(this).addClass("row-"+(count+1));
		
		$(this).find("td").each(function(e) {	
			$(this).addClass("col-"+$letters[e]);
		});
	});
	
	// $(".tablizer-content-fixed").scroll(function(e) {
		// $(".tablizer-content-numbering").scrollTop(this.scrollTop());
	// });
	
	this.parent().css("width",options.width).css("width", "-="+$(".tablizer-content-numbering").css("width"));
	this.parent().css("height",options.height).css("height", "-="+$(".tablizer-content-lettering").css("height"));
	
	this.parent().siblings(".tablizer-content-lettering").css("width",options.width);
	this.parent().siblings(".tablizer-content-numbering").css("height",options.height).css("height","-="+$(".tablizer-content-lettering").css("height"));
	
	// SCROLL
	$horizonScroll = "<div class=\"tablizer-horizontal-scroll\"></div>";
	//$horizonScroll = "<div class=\"tablizer-horizontal-scroll\"><div class=\"tablizer-scroller\"></div></div>";
	this.parent().after($horizonScroll);
	
	//$widthScroll = (parseInt(options.width, 10)*100)/parseInt(this.css("width"), 10);
	
	//this.parent().siblings(".tablizer-horizontal-scroll").css("width",options.width);
	//this.parent().siblings(".tablizer-horizontal-scroll").find(".tablizer-scroller").css("width",$widthScroll+"%").css("width","-="+2);
	
	this.on("click","td",function() {
		$colHead = ".h-"+$(this).attr("class");
		_tablizerTable.parent().siblings(".tablizer-content-lettering").find(".c-selected").removeClass("c-selected");
		_tablizerTable.parent().siblings(".tablizer-content-lettering").find($colHead).addClass("c-selected");
		
		$rowHead = ".h-"+$(this).parent("tr").attr("class");
		_tablizerTable.parent().siblings(".tablizer-content-numbering").find(".r-selected").removeClass("r-selected");
		_tablizerTable.parent().siblings(".tablizer-content-numbering").find($rowHead).addClass("r-selected");
		
		_tablizerTable.parent().find(".selected").removeClass("selected");
		$(this).addClass("selected");
	});
	
	$dragging = null;
	
	$(document).on("mousedown",".tablizer-scroller",function(e) {
		$dragging = $(e.target);
		$elementOffSet = e.offsetX;
		$startScroll = e.pageX;
		$margAtual = parseInt($dragging.css("marginLeft"));
	});
	
	$(document).mouseup(function() {
		$dragging = null;
	});

	$(document).mousemove(function(e) {
		if ($dragging) {
			$positionScroll = (e.pageX-$startScroll);
			
			$pLeft = parseInt($dragging.css("marginLeft"));
			$pLeftMax = (parseInt($dragging.parent().css("width")) - parseInt($dragging.css("width")) - 1);
			
			if ($pLeft  >= 1 && $pLeft  <= $pLeftMax) {
				$dragging.css("marginLeft",$margAtual+$positionScroll);
			} else if ($pLeft  < 1) {
				$dragging.css("marginLeft",1);
			} else if ($pLeft  > $pLeftMax) {
				$dragging.css("marginLeft",$pLeftMax);
			}
		}
	});
};

}( jQuery ));