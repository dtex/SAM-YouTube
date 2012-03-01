/* 
		1) To embed a YouTube Video you first need a call to the json data. Change the 
		author property to the YouTube account you are looking at:
		
		<xsl:text disable-output-escaping='yes'><![CDATA[
        	<script type="text/javascript" src="http://gdata.youtube.com/feeds/api/videos?callback=yt&amp;alt=json-in-script&amp;orderby=published&amp;author=BrandExtract&amp;v=2&max-results=50"></script>
		]]></xsl:text>
		
		2) Then you need a div to stick the video into. Change the rel property to 
		a keyword match for the particular video you want to enter
		
		<div class="embedYouTubeVideo" rel="featured"></div>
		
		If you set rel="all" then all the videos in the feed will be output
		
		If you add class "multi" to your div, multiple videos will be output in a grid.
		You can set the column and row variables below to control the size
		
		By default the videos thumbnails will link to YouTube.
		
		If you add class "inline" to your div, an inline video player will replace the thumbnail
		
		If you add class "litebox" teh video will play in a litebox. You will also need 
		
		If you are displaying images in a lightbox, you will need flowplayer and jQuery tools:
		<script src="/js/jquery.tools.min.js"></script>
		
		You will also need this in your XSL, before your call for json from YouTube:
		<xsl:text disable-output-escaping="yes"><![CDATA[<div class="overlay" style="background-image:url('/images/spacer.gif')"><a id="player">&nbsp;</a></div>]]></xsl:text>
		
		Here is some sample CSS to get started:
		
		.embedYouTubeVideo { margin-bottom:24px; }
		.embedYouTubeVideo .vidThumb { height:195px; width:260px; float:left;}
		.embedYouTubeVideo .vidThumb img.thumb {height:195px; width:260px;border: solid 1px #9c9c9f;}
		.embedYouTubeVideo .vidThumb img.playButton {position:absolute;margin:67px 0 0 98px;}
		.embedYouTubeVideo .youTube { float:left; }
		.embedYouTubeVideo .youTubeVideoDescription { width:188px;float:right;padding: 0 16px;}
		.embedYouTubeVideo .youTubeVideoDescription p {width:188px;}
		.embedYouTubeVideo h3 { float:right;width:188px;font-size:13px;font-family:Helvetica, arial, sans-serif;font-weight:bold;padding:0 16px;}

		.embedYouTubeVideo.multi .youtubeVideo {float:left; margin:0 23px 12px 0;width:100px;}
		.embedYouTubeVideo.multi .youtubeVideo.last {margin:0 0 24px 0;}
		.embedYouTubeVideo.multi .vidThumb  {float:left; margin:0 23px 12px 0;width:100px;height:75px;}
		.embedYouTubeVideo.multi .vidThumb img.thumb { width: 100px;height:75px;}
		.embedYouTubeVideo.multi .vidThumb img.playButton {margin:11px 0 0 20px;}
		.embedYouTubeVideo.multi h3 { font-weight:normal;width:100px;float:none;padding:0; }
		.embedYouTubeVideo.multi .youTubeVideoDescription { display:none;}

		.overlay {padding:9px 40px;	width:576px;display:none;background-color:#fff;}
		.close {background:url(/images/close.png) no-repeat;position:absolute;top:9px;right:12px; display:block;width:21px;height:21px;cursor:pointer;}
				
*/

var yt = function (data) {
	
	// Length of data feed
	var myLength = data.feed.entry.length, columns = 4, rows = 2;
	
	jQuery(".embedYouTubeVideo").each( function () {
		
		
		var $this = jQuery(this), keyword = $this.attr('rel'), done = false;
		
		for (i = 0, j = 0; i < myLength && j < columns * rows; i = i + 1) {
			var item = data.feed.entry[i], myKeywords = item.media$group.media$keywords.$t, $anchor;
			
			// if this video contains the keyword we are looking for, or we are showing all the videos
			if(myKeywords.indexOf(keyword) > -1 || keyword === 'all') {
				
				// This will be all the pieces that we insert into the dom
				var myid = keyword+'Vid'+String(i),
					$container = jQuery('<div class="youtubeVideo" />'),
					$thumbContainer = $this.hasClass('inline') ? jQuery('<div class="vidThumb" id="'+myid+'" />') : jQuery('<div class="vidThumb"><div id="'+myid+'" /></div>'),
					$img = jQuery('<img class="playButton" src="/images/playButton.png" /><img class="thumb" src="'+item.media$group.media$thumbnail[1].url+'" />'),
					$descriptionContainer = jQuery('<div class="youTubeVideoDescription"><p /></div>'),
					$titleContainer = jQuery('<h3 />'),
					$clear = jQuery('<div class="clear" />');
				
				// Our link varies depending on wether we are linking, showing inline or showing in a lightbox
				if ( $this.hasClass('litebox') ) {
					$anchor = jQuery('<a rel="div.overlay" href="'+item.media$group.media$content[0].url+'" />');
				} else if ( $this.hasClass('inline') ) {
					$anchor = jQuery('<a href="'+item.media$group.media$player.url+'" />');
				} else {
					$anchor = jQuery('<a href="'+item.link[0].href+'" />');
				}
				
				// Build our thumb, title and description containers
				if ($this.hasClass('inline')) {
					$thumbContainer.find('div').html('&nbsp;');
				} else {
					$thumbContainer.append($anchor.clone()).find('a').append($img);
				}
				$titleContainer.append($anchor.clone()).find('a').html(item.title.$t);
				$descriptionContainer.find('p').html(item.media$group.media$description.$t);
				
				// Insert everything into the DOM
				// You can change the order that things are inserted into the DOM here.
				if ($this.hasClass('multi')) {
					$container.append($thumbContainer, $titleContainer, $descriptionContainer, $clear);
					$this.append($container);
				} else {
					$container.append($thumbContainer, $titleContainer, $descriptionContainer, $clear);
					$this.append($container);
				}
								
				j = j + 1;
				
				// If this is the last image in a row, add a clearing div
				if ($this.hasClass('multi') && i !== 1 && (i + 1) % columns === 0) {
					$this.append($clear.clone());
					$container.addClass('last');
				}
				
				// If this is an inline view, then insert the video inline
				if ($this.hasClass('inline')) {
					swfobject.embedSWF(item.content.src+'&rel=0', myid, $thumbContainer.width(), $thumbContainer.height(), "9.0.0","expressInstall.swf", {}, {wmode:"transparent"}, {});
				}
			}
			
		}
		
	});
	
	jQuery('a[rel="div.overlay"]').overlay({
		effect: 'apple',
		mask: {
			color: '#000',
			loadSpeed: 200,
			opacity: 0.7
		},
		onLoad: function( e ) {
			var $this = jQuery(e.target);
			flashembed('player', $this.parents('a').attr('href')+"&amp;autoplay=1&controls=0&rel=0");
		}
	});
		
}