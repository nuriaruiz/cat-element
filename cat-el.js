import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';






class CatEl extends PolymerElement {
    static get template() {
        return html`
     <style is="custom-style">
      paper-icon-button {
          width: 100px;
          height: 100px;
          color: red;
      };
      paper-card {
          --paper-card-header-color: pink;
      }
      paper-card .card-content{
          padding: 16px;
          font-size: 20px;
          font-weight: 400;
          color: black;
      }
      paper-card .card-actions {
          background-color: black;
      }

    </style>
    <paper-card image$={{urlCat}} alt="Cute Cat">
      <div class="card-content">
          <span> Image by <a href$="{{imageBy}}" target="_blank" style="color: pink;">{{imageByName}}</a> from <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=300572" target="_blank" style="color: black;">Pixabay</a></span><br>
          
      </div>
      <div class="card-actions">
        <paper-icon-button icon="favorite" on-click="getUrl"></paper-icon-button>
      </div>
    </paper-card>
    `;
    }


    static get properties() {
        return {
            imageByName: {
                type: String,
                value: 'Ty Swartz',
                reflectToAttribute: true,
                readOnly: false,
                notify: true
            },
            imageBy: {
                type: String,
                value: 'https://pixabay.com/users/Ty_Swartz-617282/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=551554',
                reflectToAttribute: true,
                readOnly: false,
                notify: true
            },
            urlCat: {
                type: String,
                value: 'https://firebasestorage.googleapis.com/v0/b/cat-service-87d49.appspot.com/o/kitty-551554_640.jpg?alt=media&token=12fc56c5-3f2c-4750-b311-8622d78cbfc9',
                reflectToAttribute: true
            }
        };
    }

    _getResource(rq, attempts) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', rq.onLoad.bind(this));
        xhr.addEventListener('error', (e) => {
            // Flaky connections might fail fetching resources
            if (attempts > 1) {
                this._getResourceDebouncer = Polymer.Debouncer.debounce(this._getResourceDebouncer,
                    Polymer.Async.timeOut.after(200), this._getResource.bind(this, rq, attempts - 1));
            } else {
                rq.onError.call(this, e);
            }
        });

        xhr.open('GET', rq.url); // false make the request synchronous
        xhr.send();
    }

    getUrl() {
        this._getResource({
            url: 'cats.json',
            onLoad(e) {
                var object = JSON.parse(e.target.responseText);
                var rand = object[Math.floor(Math.random() * object.length)];
                this.urlCat = encodeURI(rand.urlCat);
                this.imageByName = rand.imageByName;
                this.imageBy = rand.imageBy;

            },
            onError(e) {
                this._setFailure(true);
            }
        }, 1);
    }

}

/**
 * elemento personalizado - notificamos al navegador del nuevo elemento
 * CatEl es la clase que extiende PolymerElement
 */
window.customElements.define('cat-el', CatEl);
