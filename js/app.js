(function(){

	window.App = {};
	window.Settings = {
		numPosts: 25,
		after: [],
		currentPage: 1,
		subreddit: '',
		commentsOpen: false,
		nsfw: false,
		subredditsArray: ["1000Words","4chan","AFOL","AMA","PersonalFinance","Jobs","Entrepreneur","Paleo","Productivity","GetDisciplined","MaleLifestyle","EveryManShouldKnow","MechanicalAdvice","HomeImprovement","History","AbandonedPorn","AdventureTime","Advice","AdviceAnimals","AlbumArtPorn","Anarchism","Android","Angel","Anime","Announcements","Anthropology","AntiConsumption","AntiJokes","Antitheism","Anxiety","Apple","Archeology","ArrestedDevelopment","Art","ArtPorn","AskCulinary","AskReddit","AskScience","Atheism","Autos","Aww","BMW","Batman","Beards","Beer","BestOf","Bikinis","BirdsWithArms","BlackAndWhite","Blog","Boobs","Books","BreakingBad","Business","CFB","Cars","Cats","Chemistry","Cinemagraphs","CircleJerk","Cities","Coffee","ComicBooks","Comics","Community","CompSci","Computers","Cooking","CrappyArt","CreepyGIFs","CringePics","CultTrailers","DIY","DailyProgrammers","Diablo3","Disney","DoctorWho","Documentaries","DoesAnybodyElse","EarthPorn","EarthPorn","Economics","Entertainment","Facepalm","Fallout","Fashion","FiftyFifty","FirstWorldAnarchists","Fishing","Fitness","FixedGearBicycle","Food","FoodPorn","Freebies","Frugal","Funny","GIFs","GameGrumps","GameMusic","GameOfThrones","GamePhysics","GamerNews","Gaming","Geek","GentlemanBoners","GetMotivated","GlutenFree","GuildWars2","HALO","HIMYM","HTML5","HappyGirls","HarryPotter","Hipster","HipsterGurlz","Hotties","Humor","IAmA","ITookAPicture","IWantToLearn","Images","IndieGaming","Israel","JailBait","Javascript","Jokes","LGBT","LadyBoners","LanguageLearning","LeagueOfLegends","LearnUselessTalents","Libertarian","LifeProTips","LoL","LoLCats","MURICA","MagicTCG","MakeupAddiction","MaleFashionAdvice","MassEffect","Meme","MensRight","MildlyInteresting","Minecraft","Mommit","Movies","MusicVideos","MyLittlePony","NBA","NFL","NewsPorn","NoFap","ObscureMedia","OffBeat","PHP","PerfectLoops","PhilosophyOfScience","Pics","Pokemon","Politics","PornFree","Portland","PrettyGirls","Privacy","Programming","RandomActsOfGaming","RandomSexyGIFs","ReactionGIFs","RealGirls","Recipes","RedditForGrownUps","RedditLaqueristas","RuneScape","Sailing","Science","Scifi","Sexy","Shit_to_watch_online","Skyrim","SnackExchange","Spotify","SquaredCircle","StarWars","Starcraft","StreetArt","Survival","TF2","Tattoos","Technology","TheLastAirbender","TheWarZ","TodayILearned","Trailers","Travel","TreePorn","Trees","TrollXChromosomes","TrueGaming","TrueReddit","UnheardOf","Videos","WTF","Warhammer","WebDev","WhereDidTheSodaGo","Wikipedia","Wine","WoahDude","Women","WorldNews","Yoga","YouShouldKnow","Zelda","fffffffuuuuuuuuuuuu","twoXchromosomes","xxFitness", "Cute", "WTFJapan","Wallpapers", "MinimalWallpaper"],
		subredditsImage: ["IAmA", "AskReddit", "bestof", "todayilearned"]
	};
	window.Elements = {
		loader: '<div class="loader"></div>'
	};
	window.Lib = {
		capitalise: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},

		excerpt: function(str, nwords) {
			var words = str.split(' '),
				start = words.slice(0, nwords),
				end = words.slice(nwords, words.length-1);
			if(start.length != words.length) {
				return start.join(' ') + '<span class="dots"> &hellip; </span><span class="fullText"> '+end.join(' ')+'</span><span class="showFull">Show whole post</span>';
			} else {
				return str;
			}
		},

		formatDate: function(timestamp) {
			var d = new Date(timestamp * 1000),
				days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				day = days[d.getDay()],
				date = d.getDate(),
				month = months[d.getMonth()],
				year = d.getFullYear(),
				hour = d.getHours() > 10 ? d.getHours() : '0' + d.getHours(),
				minutes = d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes(),
				formated = day + ', ' + date + ' ' + month + ' ' + year + ' ' + hour + ':' + minutes;
			return formated;
		},

		urlify: function(text){
			var regExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			return text.replace(regExp,"<a href='$1' target='_blank'>$1</a>");
		},

		createCookie: function(name, value, days) {
			var expires;
			if(days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				expires = '; expires='+date.toGMTString();
			} else {
				expires = '';
			}
			document.cookie = name+'='+value+expires+'; path=/';
		},

		readCookie: function(name) {
			var n = name + '=',
				ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1, c.length);
				if(c.indexOf(n) === 0) return c.substring(n.length, c.length);
			}
			return false;
		},

		eraseCookie: function(name) {
			Lib.createCookie(name,"",-1);
		}
	};

})();

App.Post = Backbone.Model.extend({
	defaults: {}
});

/*=============================================================
* Post view
==============================================================*/

App.PostView = Backbone.View.extend({
	tagName: 'div',
	className: 'post cf',

	tpl_header: _.template('\
		<% if(this.model.collection.indexOf(this.model) === this.model.collection.length-1 ) { this.$el.addClass("last"); } %>\
		<div class="postHeader cf">\
			<h3><%= title %></h3>\
			<div class="score"><%= score %></div>\
		</div>\
	'),

	tpl_footer: _.template('\
		<div class="postFooter cf">\
			<div class="meta">\
				<p class="origin">\
					Posted by <a class="author" href="http://www.reddit.com/user/<%= author %>" target="_blank"><%= author %></a>\
					on <a class="subreddit" href="#<%= subreddit %>"><%= subreddit %></a>\
				</p>\
				<p class="time"><%= time %></p>\
			</div>\
			<div class="links">\
				<a class="showComments" href="#" data-permalink="<%= permalink %>">Comments (<%= num_comments %>)</a> | \
				<a class="toReddit" href="http://www.reddit.com/<%= permalink %>" target="_blank">View on Reddit</a>\
			</div>\
		</div>\
	'),

	tpl_default: _.template('\
		<div class="postContent cf">\
			<a href="<%= url %>" class="oembed"><%= url %></a>\
			<a href="<%= url %>" class="toArticle" target="_blank">Link to the article</a>\
		</div>\
	'),

	tpl_image: _.template('\
		<div class="postContent cf">\
			<a href="<%= url %>" target="_blank"><img src="<%= url %>"></a>\
		</div>\
	'),

	tpl_post: _.template('\
		<div class="postContent cf">\
			<p class="text"><%= Lib.excerpt(Lib.urlify(selftext), 100) %></p>\
		</div>\
	'),

	tpl_reddit: _.template('\
		<div class="postContent cf">\
			<img src="css/img/<%= subreddit %>.png" alt="<%= subreddit %>" />\
			<% if(selftext){%>\
				<p class="text"><%= Lib.excerpt(Lib.urlify(selftext), 100) %></p>\
			<% } else { %>\
				<a href="<%= url %>" class="oembed"><%= url %></a>\
				<a href="<%= url %>" class="toArticle" target="_blank">Link to the article</a>\
			<% } %>\
		</div>\
	'),

	tpl_imgur: _.template('\
		<div class="postContent cf">\
			<a href="<%= url %>.jpg" target="_blank"><img src="<%= url %>.jpg"></a>\
		</div>\
	'),

	tpl_imguralb: _.template('\
		<div class="postContent cf">\
			<iframe class="imgur-album" width="100%" height="550" frameborder="0" src="<%= url %>/embed"></iframe>\
		</div>\
	'),

	tpl_video: _.template('\
		<div class="postContent cf">\
			<iframe src="<%= embed %>" width="100%" height="350" frameborder="0" allowfullscreen></iframe>\
		</div>\
	'),

	tpl_nsfw: _.template('\
		<div class="postContent cf">\
		<div class="nsfw_check">\
			<p>This post is marked <strong>"Not Safe For Work"</strong>, to display it, check "Show NSFW" in the Settings.</p>\
		</div>\
		</div>\
	'),

	tpl_comment: _.template('\
		<div id="comments">\
			<div id="commentsHeader">\
				<a href="#" id="closeComments" title="Close comments">X</a>\
				<h4><%= this.model.get("title") %></h4>\
			</div>\
			<div id="commentsContent"><div class="loader"></div></div>\
		</div>\
	'),

	events: {
		'click .showComments': 'showComments',
		'click .showFull': 'showFullText'
	},

	render: function(){
		this.model.set('time', Lib.formatDate(this.model.get('created')));
		var type = this.getTypeOfLink(),
			modelData = this.model.toJSON(),
			showNsfw = Settings.nsfw;
		this.$el.html(this.tpl_header(modelData));
		if(!this.model.get('over_18') || (this.model.get('over_18') && showNsfw)) {
			switch (type) {
				case 'image': 
					this.$el.append(this.tpl_image(modelData));
					break;
				case 'reddit': 
					this.$el.append(this.tpl_reddit(modelData));
					break;
				case 'post':
					this.$el.append(this.tpl_post(modelData));
					break;
				case 'imgur':
					this.$el.append(this.tpl_imgur(modelData));
					break;
				case 'imguralb':
					this.$el.append(this.tpl_imguralb(modelData));
					break;
				case 'video':
					this.$el.append(this.tpl_video(modelData));
					break;
				default: 
					this.$el.append(this.tpl_default(modelData));
					break;
			}
		} else {
			this.$el.append(this.tpl_nsfw());
		}
		this.$el.append(this.tpl_footer(modelData));
		return this;
	},

	getTypeOfLink: function() {
		var link = this.model.get('url'),
			lastPart = link.split('.')[link.split('.').length - 1];
		// image
		if(lastPart === 'jpg' || lastPart === 'png' || lastPart === 'gif') {
			return 'image';
		}
		// imgur
		else if(new RegExp('^(?!.*\/a\/).*imgur.*$', 'i').test(link)) {
			return 'imgur';
		}
		// imgur album
		else if(new RegExp('imgur.com/a/').test(link)) {
			return 'imguralb';
		}
		// reddit 
		else if(Settings.subredditsImage.indexOf(this.model.get('subreddit')) > -1) {
			return 'reddit';
		}
		// text post
		else if(this.model.get('selftext')) {
			return 'post';
		}
		// youtube
		else if(new RegExp('youtube.com').test(link)) {
			var embed = link.split('v=')[1];
			embed = embed.split('&')[0];
			embed = 'http://www.youtube.com/embed/' + embed;
			this.model.set('embed', embed);
			return 'video';
		}
		else if(new RegExp('youtu.be').test(link)) {
			var embed = link.split('/')[3];
			embed = 'http://www.youtube.com/embed/' + embed;
			this.model.set('embed', embed);
			return 'video';
		}
		// vimeo
		else if(new RegExp('vimeo').test(link)) {
			var split = link.split('/'),
				embed = 'http://player.vimeo.com/video/'+split[split.length - 1];
			this.model.set('embed', embed);
			return 'video';
		}

	},

	showComments: function(e) {
		e.preventDefault();
		
		var permalink = $(e.currentTarget).data('permalink'),
			title = this.model.get('title');

		var commentsCollection = new App.CommentsCollection([], {
				url: 'http://www.reddit.com'+permalink+'.json?jsonp=?&sort=top',
				op: this.model.get('author')
			});
		var commentsCollectionView = new App.CommentsCollectionView({ collection: commentsCollection });

		if(!Settings.commentsOpen){
			$(this.tpl_comment()).appendTo($('body')).animate({right: 0}, 400);
			Settings.commentsOpen = true;
		} else {
			$('#commentsHeader h4').text(title);
			$('#commentsContent').html($('<div class="loader"></div>'));
		}
		
		this.closeComments();
	},

	closeComments: function() {
		$('#closeComments').on('click', function(e){
			e.preventDefault();
			Settings.commentsOpen = false;
			var $comments = $('#comments'),
				width = $comments.outerWidth();
			$('#comments').animate({right: -width }, 400, function(){
				$('#comments').remove();
			});
		});
	},

	showFullText: function() {
		this.$el.find('.fullText').show();
		this.$el.find('.dots').hide();
		this.$el.find('.showFull').hide();
	}
});

/*=============================================================
* Post collection
==============================================================*/

App.PostCollection = Backbone.Collection.extend({
	model: App.Post, 

	initialize: function(models, options) {
		this.url = options.url;
		this.fetch();
	},

	parse: function(response) {
		var parsed = [],
			children = response.data.children;
		Settings.after.push(response.data.after);
		for(var child in children){
			parsed.push(children[child].data);
		}
		return parsed;
	}
});

/*=============================================================
* Post collection view
==============================================================*/

App.PostCollectionView = Backbone.View.extend({
	tagName: 'div',
	className: 'contentWrapper',

	template: _.template('\
		<div id="pages">\
			<% if (Settings.after.length > 1) { %>\
				<a href="#" id="previous">Previous</a>\
			<% } %>\
			<a href="#" id="next">Next</a>\
		</div>\
	'),

	events: {
		'click #next': 'nextPage',
		'click #previous': 'previousPage'
	},

	initialize: function() {
		$('#content').html(Elements.loader);
		this.collection.on('sync', this.render, this);
	},

	render: function() {
		this.$el.html(this.template());
		this.collection.each(this.renderPost, this);
		$('#content').html(this.$el);
		this.loadOembed();
		return this;
	},

	renderPost: function(post) {
		var postView = new App.PostView({model: post});
		this.$el.append(postView.render().el);
	},

	nextPage: function(e) {
		e.preventDefault();
		var url;
		Settings.currentPage++;
		if(Settings.subreddit) {
			url = "http://www.reddit.com/r/"+Settings.subreddit+"/.json?jsonp=?&limit="+Settings.numPosts+"&sort=new&after="+Settings.after[Settings.after.length-1];
		} else {
			url = "http://www.reddit.com/.json?jsonp=?&limit="+Settings.numPosts+"&after="+Settings.after[Settings.after.length-1];
		}
		var newPostCollection = new App.PostCollection([], {url: url});
		var newPostCollectionView = new App.PostCollectionView({ collection: newPostCollection });
	},

	previousPage: function() {
		var url;
		Settings.after.pop();
		Settings.after.pop();
		Settings.currentPage--;
		if(Settings.subreddit) {
			url = "http://www.reddit.com/r/"+Settings.subreddit+"/.json?jsonp=?&limit="+Settings.numPosts+"&sort=new&after="+Settings.after[Settings.after.length-1];
		} else {
			url = "http://www.reddit.com/.json?jsonp=?&limit="+Settings.numPosts+"&after="+Settings.after[Settings.after.length-1];
		}
		var newPostCollection = new App.PostCollection([], {url: url});
		var newPostCollectionView = new App.PostCollectionView({ collection: newPostCollection });
	},

	loadOembed: function() {
		$('a.oembed').oembed();
	}

});

/*=============================================================
* Input view
==============================================================*/

App.InputView = Backbone.View.extend({
	el: '#search',

	events: {
		'keypress input': 'filter',
		'focus input': 'enlarge',
		'blur input': 'shrink'
	},

	initialize: function() {
		var array = Settings.subredditsArray;
		this.$el.find('input').autocomplete({
			minLength: 2,
			source: function(req, resp) {
				var res = $.ui.autocomplete.filter(array, req.term);
				resp(res.slice(0,5));
			},
			select: function(e, ui) {
				var r = ui.item.value;
				$(this).val('').blur();
				window.location.href = '#'+r;
			}
		});
	},

	enlarge: function() {
		this.$el.animate({width: 300}, 400);
	},

	shrink: function() {
		this.$el.animate({width: 205}, 400);
	},

	filter: function(e) {
		if(e.keyCode === 13) {
			this.submit();
		}
	},

	submit: function() {
		var r = this.$el.find('input').val();
		this.$el.find('input').val('').blur();
		window.location.href = '#'+r;
	}
});

/*=============================================================
* Mobile input view
==============================================================*/

App.MobileInputView = Backbone.View.extend({
	el: '#mobileSearch',

	events: {
		'keypress input': 'filter'
	},

	filter: function(e) {
		if(e.keyCode === 13) {
			this.submit();
			$.sidr('close');
		}
	},

	submit: function() {
		var r = this.$el.find('input').val();
		this.$el.find('input').val('').blur();
		window.location.href = '#'+r;
	}
});

/*=============================================================
* Comment model
==============================================================*/

App.Comment = Backbone.Model.extend({

});

/*=============================================================
* Comment view
==============================================================*/

App.CommentView = Backbone.View.extend({
	tagName: 'li',
	className: 'comment cf',

	events: {
		'click .toggleReplies': 'toggleReplies'
	},

	template: _.template('\
		<% if(this.model.get("replies") && this.model.get("replies").length > 1) { %>\
			<a href="#" class="toggleReplies closed" title="Show replies">[+]</a>\
		<% } %>\
		<p class="author <% if(this.model.get("author") == this.model.collection.op){ %> op <% } %>"><%= this.model.get("author") %></p>\
		<p class="score" title="Comment\'s score"><%= this.model.get("ups") - this.model.get("downs") %></p>\
		<p class="body"><%= this.model.get("body") %></p>\
		<% if(this.model.get("replies") && this.model.get("replies").length > 1) { %>\
			<ul class="replies">\
				<% for (var i = 0, rep = this.model.get("replies") ; i < rep.length - 1 ; i++) { %>\
					<li class="cf">\
						<p class="author <% if(rep[i].data.author == this.model.collection.op){ %>op<% } %>"><%= rep[i].data.author %></p>\
						<p class="score"><%= rep[i].data.ups - rep[i].data.downs %></p>\
						<p class="body"><%= Lib.urlify(rep[i].data.body) %></p>\
					</li>\
				<% } %>\
			</ul>\
		<% } %>\
	'),

	render: function() {
		if(this.model.get('replies')){
			this.model.set('replies', this.model.get('replies').data.children);
		}
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	toggleReplies: function(e) {
		e.preventDefault();
		if($(e.currentTarget).hasClass('closed')){
			$(e.currentTarget).text('[-]').removeClass('closed').parent().find('ul').slideDown();
		} else {
			$(e.currentTarget).text('[+]').addClass('closed').parent().find('ul').slideUp();
		}
	}
});

/*=============================================================
* Comment Collection
==============================================================*/

App.CommentsCollection = Backbone.Collection.extend({
	model: App.Comment, 

	initialize: function(models, options) {
		this.url = options.url;
		this.op = options.op;
		this.fetch();
	},

	parse: function(response) {
		var parsed = [],
			children = response[1].data.children;
		for(var child in children){
			parsed.push(children[child].data);
		}
		return parsed;
	}
});

/*=============================================================
* Comment collection view
==============================================================*/

App.CommentsCollectionView = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.collection.on('sync', this.render, this);
	},

	render: function() {
		this.collection.each(this.renderComment, this);
		$('#commentsContent').html(this.$el);
		return this;
	},

	renderComment: function(comment) {
		var commentView = new App.CommentView({model: comment});
		this.$el.append(commentView.render().el);
	}

});

/*=============================================================
* Routes
==============================================================*/

App.Router = Backbone.Router.extend({

	routes: {
		'': 'index',
		':r': 'subreddit',
		'post/:id': 'singlePost',
		'*other': 'returnToIndex'
	},

	index: function() {
		var postCollection = new App.PostCollection([], {url: 'http://www.reddit.com/.json?jsonp=?&limit='+Settings.numPosts+'&sort=new'});
		var postCollectionView = new App.PostCollectionView({ collection: postCollection });
	},

	subreddit: function(r) {
		$('#current').text(r);
		document.title = Lib.capitalise(r) + ' | Reddit-Roll';
		Settings.subreddit = r;
		Settings.after = [];
		var newPostCollection = new App.PostCollection([], {url: 'http://www.reddit.com/r/' + r + '/.json?jsonp=?&limit='+ Settings.numPosts +'&sort=new'});
		var newPostCollectionView = new App.PostCollectionView({ collection: newPostCollection });
	},

	singlePost: function(id) {
		console.log('post route:' + id);
	},

	returnToIndex: function() {
		window.location.href = 'index.html';
	}
});

/*=============================================================
* Initialization
==============================================================*/

$(function(){

	// Reading cookies
	if(Lib.readCookie('nsfw')) {
		Settings.nsfw = true;
		$('.nsfw').prop('checked', 'checked');
	}

	if(Lib.readCookie('numPosts')) {
		var value = Lib.readCookie('numPosts');
		Settings.numPosts = value;
		$('.numPosts').val(value);
		$('.numPostsValue').text(value);
	}
	
	// Start the router	
	new App.Router;
	Backbone.history.start();

	// Init input
	var inputView = new App.InputView();
	var MobileInputView = new App.MobileInputView();
	
	// Event handlers
	$('#settings').on('click', function(e){
		e.preventDefault();
		if($(this).hasClass('closed')){
			$('.settings').slideDown();
		} else {
			$('.settings').slideUp();
		}
		$(this).toggleClass('closed');
	});

	$('#suggestions').on('click', function(e){
		e.preventDefault();
		if($(this).hasClass('closed')){
			$('.suggestions').slideDown();
		} else {
			$('.suggestions').slideUp();
		}
		$(this).toggleClass('closed');
	});

	$('.nsfw').on('click', function(){
		if($(this).prop('checked')){
			Settings.nsfw = true;
			Lib.createCookie('nsfw', true, 365);
		} else {
			Settings.nsfw = false;
			Lib.eraseCookie('nsfw');
		}
	});

	$('.numPosts').on('change', function(){
		var value = $(this).val();
		$('.numPostsValue').text(value);
	});

	$('.numPosts').mouseup(function() {
		var value = $(this).val();
		Settings.numPosts = value;
		Lib.createCookie('numPosts', value, 365);
	});

	$('#randomSubreddit').on('click', function(e) {
		e.preventDefault();
		var arr = Settings.subredditsArray,
			rd = Math.floor(Math.random()*arr.length),
			r = arr[rd];
		window.location.href = '#' + r;
	});

	$('.suggestions a').on('click', function(e) {
		e.preventDefault();
		var $this = $(this),
			$ul = $this.parent().find('ul');
		$this.toggleClass('open');
		if($this.hasClass('open')){
			$ul.slideDown();
		} else {
			$ul.slideUp();
		}
	});

	$('.suggested-r a').on('click', function(e) {
		e.preventDefault();
		var r = $(this).text();
		window.location.href = '#' + r;
	});

	// Sidr Menu 
	$('.mobileMenu').sidr();
});

