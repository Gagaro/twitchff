$(document).ready(function() {

    var check_live_stream = function(stream) {
	$('#successs, #offline, #error').hide();

        $.ajax({
	    dataType: 'jsonp',
	    headers: {'Accept': 'application/vnd.twitchtv.v3+json'},
	    url: 'https://api.twitch.tv/kraken/streams/'+ stream,
	})
	.done(function(data){
	    console.log('success', data);
	    if (data.stream == null) {
		$('#offline').show();
	    } else {
		$('#logo').attr('src', data.stream.channel.logo);
		$('#preview').attr('src', data.stream.preview.medium);
		$('#success').show();
	    }
	    
	    // Get Access Token
            $.ajax({
		dataType: 'jsonp',
		headers: {'Accept': 'application/vnd.twitchtv.v3+json'},
		url: 'http://api.twitch.tv/api/channels/'+ stream +'/access_token'
	    })
	    .done(function(data){
		console.log('success url', data);

		/*
		var url = 'http://usher.twitch.tv/api/channel/hls/'+ stream +'.m3u8?' +
		    'player=twitchweb&&token='+ data.token +'&sig='+ data.sig +'&' +
		    'allow_audio_only=true&allow_source=true&type=any&p=123456';
		console.log(url);

		new MozActivity({
		    name: "open",
		    data: {
			type: [
			    "video/webm",
			    "video/mp4",
			    "video/3gpp",
			    "video/youtube"
			],
			url: url
		    }
		});
		*/

	    })
	    .fail(function(error){
		console.log('error url', error);
	    });
	    

	})
	.fail(function(error){
	    console.log('error', error);
	    $('#error').show();
	});
    };

    var check_past_broadcast = function (stream) {
	$('#past_broadcast ul').html('');

        $.ajax({
	    dataType: 'jsonp',
	    headers: {'Accept': 'application/vnd.twitchtv.v3+json'},
	    url: 'https://api.twitch.tv/kraken/channels/'+ stream +'/videos/?limit=4',
	})
	    .done(function(data){
		console.log('broadcast success', data);

		$.each(data.videos, function (index, video) {
		    $('#past_broadcast ul').append(
			'<li><a href="#" class="broadcast" data-id="'
			    + video._id
			    + '"><img src="' + video.preview
			    + '" /><br />' + video.title + '</a></li>');
		});
	    })
	    .fail(function(error){
		console.log('broadcast error', error);
		$('#past_broadcast').html('Error');
	    });
    };

    $("#search-btn").click(function(event) {
	event.preventDefault();
	var stream = $('#stream').val();

	check_live_stream(stream);
	check_past_broadcast(stream);
    });

    $('#past_broadcast').on('click', '.broadcast', function(event) {
	event.preventDefault();

	var id = $(this).attr('data-id');
        $.ajax({
	    dataType: 'jsonp',
	    headers: {'Accept': 'application/vnd.twitchtv.v3+json'},
	    url: 'https://api.twitch.tv/api/videos/'+ id,
	})
	    .done(function(data) {
		console.log('success video', data);

		var url = data.chunks.live[0].url;

		new MozActivity({
		    name: "open",
		    data: {
			type: [
			    "video/webm",
			    "video/mp4",
			    "video/3gpp",
			    "video/youtube",
			    "video/x-flv",
			],
			url: url
		    }
		});
	    })
	    .fail(function(error) {
		console.log('error video', error);
	    });
	
    });

});
