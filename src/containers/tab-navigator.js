import AvocadoTab from '../controls/tab.js';

export default class AvocadoTabNavigator extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        div:first-of-type {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
        }

        div:last-of-type {
          background-color: #f4f4f4;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        div:first-of-type adc-tab:first-of-type {
          border-left: solid 1px transparent;
        }

        adc-tab[selected] + abc-tab {
          border-left: solid 1px transparent;
        }
      </style>
      <div part="bar"></div>
      <div part="stack">
        <slot></slot>
      </div>
    `;

    // Properties
    this._data = null;
    this._observer = new MutationObserver( this.invalidate.bind( this ) );

    // Events
    this.doTabClick = this.doTabClick.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$bar = shadowRoot.querySelector( 'div[part=bar]' );
    this.$stack = shadowRoot.querySelector( 'slot' );
    this.$stack.addEventListener( 'slotchange', () => {
      // Observer for disabled
      this._observer.disconnect();

      // Remove excess
      while( this.$bar.children.length > this.children.length ) {
        this.$bar.children[0].removeEventListener( 'click', this.doTabClick );
        this.$bar.children[0].remove();
      }

      // Add where needed
      while( this.$bar.children.length < this.children.length ) {
        const tab = document.createElement( 'adc-tab' );
        tab.addEventListener( 'click', this.doTabClick );
        this.$bar.appendChild( tab );
      }

      const selected = this.selectedIndex === null ? 0 : this.selectedIndex;

      // Iterate to populate content and set state
      for( let c = 0; c < this.$bar.children.length; c++ ) {
        this.$bar.children[c].index = c;
        this.$bar.children[c].label = this.children[c].label;        
        this.$bar.children[c].hint = this.children[c].hint;
        this.$bar.children[c].disabled = this.children[c].disabled;
        this.$bar.children[c].selected = c === selected ? true : false;       
        
        this.children[c].hidden = c === selected ? false : true; 
        this._observer.observe( this.children[c], {attributeFilter: ['disabled']} ); 
      }
    } );
  }

  // Called when observable is changed
  // Updates buttons in tab bar
  invalidate() {
    for( let c = 0; c < this.children.length; c++ ) {
      this.$bar.children[c].disabled = this.children[c].disabled;
    }
  }

  // Called when tab is clicked
  doTabClick( evt ) {
    // Tab is disabled
    // Ignore
    if( evt.currentTarget.disabled ) 
      return;


    // Only change if different
    if( this.selectedIndex !== evt.currentTarget.index )
      this.selectedIndex = evt.currentTarget.index;
  }

  // When things change
  _render() {
    const selected = this.selectedIndex === null ? 0 : this.selectedIndex;

    for( let t = 0; t < this.$bar.children.length; t++ ) {
      this.$bar.children[t].selected = t === selected ? true : false;
      this.children[t].hidden = t === selected ? false : true;
    }
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'concealed' );
    this._upgrade( 'disabled' );
    this._upgrade( 'hidden' );
    this._upgrade( 'selectedIndex' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'selected-index'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null 
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
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

window.customElements.define( 'adc-tab-navigator', AvocadoTabNavigator );
