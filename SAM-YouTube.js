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
				if (i == myLength || ($this.hasClass('multi') && i !== 1 && (i + 1) % columns === 0)) {
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