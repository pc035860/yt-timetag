import {
  MSG_PLAYER_API_RESULT,
  MSG_PLAYER_API,
  MSG_PLAYER_STATE_CHANGE,
} from '_constants/Messages';

/**
 * inject script 到網頁的 context 內執行
 * @param  {function} func function
 */
function inject(func, args_) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  // script.appendChild(document.createTextNode("var chromePage = \"" + chromePage + "\";\n"));
  // script.appendChild(document.createTextNode("var inIncognito = " + chromeInIncognito + ";\n"));

  const args = args_.map((v) => JSON.stringify(v));
  script.appendChild(document.createTextNode(`(${func})(${args.join(',')});`));
  document.body.appendChild(script);
}

inject(
  (CONST) => {
    const getPlayer = (() => {
      let _ytPlayer;

      if (_toString(window.onYouTubePlayerReady) !== '[object Function]') {
        window.onYouTubePlayerReady = function (player) {
          _ytPlayer = player;
          _ytPlayer.addEventListener('onStateChange', _onPlayerStateChange);
          _onPlayerReady();
        };
      } else {
        const origOnYouTubePlayerReady = window.onYouTubePlayerReady;
        window.onYouTubePlayerReady = function (player) {
          _ytPlayer = player;
          _ytPlayer.addEventListener('onStateChange', _onPlayerStateChange);
          origOnYouTubePlayerReady(player);
          _onPlayerReady();
        };
      }

      return function () {
        if (_ytPlayer) {
          return _ytPlayer;
        } else if (
          _toString(window.yt.config_.PLAYER_REFERENCE) === '[object Object]'
        ) {
          return window.yt.config_.PLAYER_REFERENCE;
        } else if (document.getElementById('movie_player') !== null) {
          _ytPlayer = document.getElementById('movie_player');
          return _ytPlayer;
        } else if (
          typeof document.getElementsByClassName('html5-video-player')[0] ===
          'object'
        ) {
          _ytPlayer = document.getElementsByClassName('html5-video-player')[0];
          return _ytPlayer;
        }

        return null;
      };
    })();

    window.addEventListener('message', (evt) => {
      let data;

      try {
        data = JSON.parse(evt.data);
      } catch (e) {
        /* catch */
      }

      if (data && data.message) {
        switch (data.message) {
          case CONST.MSG_PLAYER_API:
            _onMessagePlayerApi(data);
            break;
          default:
            // nothing
            break;
        }
      }
    });

    function _onPlayerReady() {}

    function _onPlayerStateChange(state) {
      _sendMessage(CONST.MSG_PLAYER_STATE_CHANGE, { state });
    }

    function _onMessagePlayerApi(data) {
      const player = getPlayer();
      let result;

      if (player) {
        result = player[data.name].apply(player, data.args);

        _sendMessage(CONST.MSG_PLAYER_API_RESULT, {
          result,
          $id: data.$id,
        });
      } else {
        _sendMessage(CONST.MSG_PLAYER_API_RESULT, {
          $id: data.$id,
          result: null,
        });
      }
    }

    function _toString(obj) {
      return Object.prototype.toString.call(obj);
    }

    function _extend(out_, ...args) {
      const out = out_ || {};

      for (let i = 0; i < args.length; i++) {
        if (!args[i]) {
          continue;
        }

        /* eslint-disable */
        for (let key in args[i]) {
          if (args[i].hasOwnProperty(key)) {
            out[key] = args[i][key];
          }
        }
        /* eslint-enable */
      }

      return out;
    }

    function _sendMessage(message, more) {
      const data = { message };

      if (Object.prototype.toString.call(more) === '[object Object]') {
        _extend(data, more);
      }

      const json = JSON.stringify(data);
      window.postMessage(json, '*');
    }
  },
  [
    {
      MSG_PLAYER_API_RESULT,
      MSG_PLAYER_API,
      MSG_PLAYER_STATE_CHANGE,
    },
  ]
);
