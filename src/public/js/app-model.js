import $ from 'jquery';
import { Dispatcher } from 'flux';
import { getFontId } from './util/content_util.js';
import appDispatcher from 'app-dispatcher';

var cache = {
  fonts: null,
  likes: null
}

class AppModel {

  constructor() {
    this.handleAppEvent = this.handleAppEvent.bind(this);
    appDispatcher.register(this.handleAppEvent);
  }

  handleAppEvent(e) {

    switch (e.actionType) {

      case 'fetch-font-data':

        if (this.isSiteDataAvailable) {
          // both fonts and likes are available and parsed, let's notify
          setTimeout(function () {
            // require timeout to avoid dispatch in same frame causing error
            appDispatcher.dispatch({ actionType: 'font-data-updated', data: cache.fonts });

          });

        } else {

          if (!this.fontsLoading) {
            this.fetchFontData();
          }

          if (!this.likesLoading) {
            this.fetchLikeData();
          }
        }
        break;
    }
  }

  fetchFontData() {

    if (this.fontsLoading || cache.fonts) {
      console.log('fonts already loaded');
      // fetching in progress: skip
      return;
    }

    this.fontsLoading = true;

    $.get('../../data/sheet.json')
      .done(function (res) {
        cache.fonts = cache.fonts || res;
        this.decorateFonts(cache.fonts);
        this.mapFontLikes()
      }.bind(this));

  }


  fetchLikeData() {

    if (this.likesLoading || cache.likes) {
      console.log('likes already loaded');
      // fetching in progress: skip
      return;
    }

    console.log('load likes');

    this.likesLoading = true;

    $.get('/api/fonts/')
      .done(function (res) {
        if (res.docs) {
          cache.likes = cache.likes || res.docs;
          this.mapFontLikes();
        } else {
          console.error('Like request: No docs found');
        }
      }.bind(this))
      .fail(function () {
        console.log('did not get likes');
      });

  }


  mapFontLikes() {

    var { fonts, likes } = cache;

    if (this.isSiteDataAvailable || !fonts || !likes || !fonts.length || !likes.length) {
      return;
    }

    fonts.forEach(function (font) {

      var likeObject = likes.find(function (like) {
        if (like.fontId === font.__key) return like.likes;
      });

      font.likesNum = likeObject ? likeObject.likes : 0;
      font.scaled = false;

    });

    // Sort fonts by likes number in ascending order
    fonts.sort((a, b) => {
      return parseFloat(b.likesNum) - parseFloat(a.likesNum);
    });

    this.isSiteDataAvailable = true;
    this.parsedFonts = fonts;

    appDispatcher.dispatch({ actionType: 'font-data-updated', data: this.parsedFonts});

  }

  decorateFonts(fonts) {

    fonts.forEach(function (font) {
      // we're using the font object as a model to be reflected
      // by any views referencing it (i.e. list & specimen).
      // This could be done better by implementing Flux entirely,
      // however this seems to work fine for now.
      font.dispatcher = new Dispatcher

      font.__key = getFontId(font);
    })
  }
}

var appModel = new AppModel;

export default appModel;
