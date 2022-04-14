/*
 * Tabs must have:
 * - Hidden attribute
 * - Data-label to specify tab label
 *
 * Optionally (if disabled):
 * - Disabled attribute
 * - Dispatches "tab" event
 */

export default class AvocadoTabs extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
          position: relative;
        }

        #tabs {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
        }

        #tabs button {
          background: none;
          background-color: #e0e0e0;
          border: none;
          border-left: solid 1px #8d8d8d;
          border-top: solid 2px transparent;
          box-sizing: border-box;
          color: #393939;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 48px;
          margin: 0;
          min-width: 145px;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0 0 0 16px;
          text-align: left;
        }

        #tabs button:first-of-type {
          border-left: solid 1px transparent;
        }

        #tabs button:hover {
          background-color: #cacaca;
        }

        #tabs button:focus {
          outline: solid 2px #005fcc;
        }

        #tabs button.selected {
          background-color: #f4f4f4;
          border-left: solid 1px transparent;
          border-top: solid 2px #0f62fe;
          color: #161616;
          font-weight: 600;
        }

        #tabs button.selected + button {
          border-left: solid 1px transparent;
        }

        #tabs button[disabled] {
          background-color: #c6c6c6;
          color: #8d8d8d;
          cursor: not-allowed;
        }

        #views {
          background-color: #f4f4f4;
          box-sizing: border-box;
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
        }
      </style>
      <div id="tabs"></div>
      <div id="views">
        <slot></slot>
      </div>
    `;

    // Properties
    this._data = null;

    // Removeable events
    this.doChange = this.doChange.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$tabs = shadowRoot.querySelector( '#tabs' );
    this.$views = shadowRoot.querySelector( 'slot' );
    this.$views.addEventListener( 'slotchange', ( evt ) => this.doChildren( evt ) );

    // Observer
    // For disabled
    this._observer = new MutationObserver( this.invalidate.bind( this ) );
  }

  invalidate() {
    for( let c = 0; c < this.children.length; c++ ) {
      this.$tabs.children[c].disabled = this.children[c].disabled;
    }
  }

  // Tab selection change
  doChange( evt ) {
    this.selectedIndex = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );
  }

  // Children added or removed
  doChildren( evt ) {
    // Observer
    // For disabled
    this._observer.disconnect();

    // Remove excess
    while( this.$tabs.children.length > this.children.length ) {
      this.$tabs.children[0].removeEventListener( 'mousedown', this.doChange );
      this.$tabs.children[0].remove();
    }

    // Add where needed
    while( this.$tabs.children.length < this.children.length ) {
      const tab = document.createElement( 'button' );
      tab.addEventListener( 'mousedown', this.doChange );
      this.$tabs.appendChild( tab );
    }

    const selected = this.selectedIndex === null ? 0 : this.selectedIndex;

    // Iterate to populate content
    // Set state
    for( let c = 0; c < this.$tabs.children.length; c++ ) {
      this.$tabs.children[c].setAttribute( 'data-index', c );

      if( this.children[c].hasAttribute( 'data-label' ) ) {
        this.$tabs.children[c].innerText = this.children[c].getAttribute( 'data-label' );
      }

      this.$tabs.children[c].disabled = this.children[c].disabled;
      this._observer.observe( this.children[c], {attributeFilter: ['disabled']} );

      // Show selected tab
      if( c === selected ) {
        this.$tabs.children[c].classList.add( 'selected' );
      } else {
        this.children[c].hidden = true;
      }
    }
  }

  // When things change
  _render() {
    // Host
    this.style.display = this.hidden === true ? 'none' : '';
    this.style.flexBasis = this.grow === null ? '' : 0;
    this.style.flexGrow = this.grow === null ? '' : 1;
    this.style.marginBottom = this.marginBottom === null ? '' : `${this.marginBottom}px`;
    this.style.marginLeft = this.marginLeft === null ? '' : `${this.marginLeft}px`;
    this.style.marginRight = this.marginRight === null ? '' : `${this.marginRight}px`;
    this.style.marginTop = this.marginTop === null ? '' : `${this.marginTop}px`;
    this.style.minHeight = this.height === null ? '' : `${this.height}px`;
    this.style.visibility = this.concealed === true ? 'hidden' : '';

    // Index
    for( let t = 0; t < this.$tabs.children.length; t++ ) {
      if( t === this.selectedIndex ) {
        this.$tabs.children[t].classList.add( 'selected' );
        this.children[t].hidden = false;
      } else {
        this.$tabs.children[t].classList.remove( 'selected' );
        this.children[t].hidden = true;
      }
    }
  }

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Default render
  // No attributes set
  connectedCallback() {
    // Check data property before render
    // May be assigned before module is loaded
    this._upgrade( 'concealed' );
    this._upgrade( 'disabled' );
    this._upgrade( 'grow' );
    this._upgrade( 'hidden' );
    this._upgrade( 'marginBottom' );
    this._upgrade( 'marginLeft' );
    this._upgrade( 'marginRight' );
    this._upgrade( 'marginTop' );
    this._upgrade( 'selectedIndex' );

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'grow',
      'hidden',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'selected-index'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Arbitrary storage
  // For your convenience
  // Not used in component
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }

  get grow() {
    if( this.hasAttribute( 'grow' ) ) {
      return parseInt( this.getAttribute( 'grow' ) );
    }

    return null;
  }

  set grow( value ) {
    if( value !== null ) {
      this.setAttribute( 'grow', value );
    } else {
      this.removeAttribute( 'grow' );
    }
  }

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }

  get marginBottom() {
    if( this.hasAttribute( 'margin-bottom' ) ) {
      return parseInt( this.getAttribute( 'margin-bottom' ) );
    }

    return null;
  }

  set marginBottom( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-bottom', value );
    } else {
      this.removeAttribute( 'margin-bottom' );
    }
  }

  get marginLeft() {
    if( this.hasAttribute( 'margin-left' ) ) {
      return parseInt( this.getAttribute( 'margin-left' ) );
    }

    return null;
  }

  set marginLeft( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-left', value );
    } else {
      this.removeAttribute( 'margin-left' );
    }
  }

  get marginRight() {
    if( this.hasAttribute( 'margin-right' ) ) {
      return parseInt( this.getAttribute( 'margin-right' ) );
    }

    return null;
  }

  set marginRight( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-right', value );
    } else {
      this.removeAttribute( 'margin-right' );
    }
  }

  get marginTop() {
    if( this.hasAttribute( 'margin-top' ) ) {
      return parseInt( this.getAttribute( 'margin-top' ) );
    }

    return null;
  }

  set marginTop( value ) {
    if( value !== null ) {
      this.setAttribute( 'margin-top', value );
    } else {
      this.removeAttribute( 'margin-top' );
    }
  }

  get selectedIndex() {
    if( this.hasAttribute( 'selected-index' ) ) {
      return parseInt( this.getAttribute( 'selected-index' ) );
    }

    return null;
  }

  set selectedIndex( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-index', value );
    } else {
      this.removeAttribute( 'selected-index' );
    }
  }
}

window.customElements.define( 'avocado-tabs', AvocadoTabs );
