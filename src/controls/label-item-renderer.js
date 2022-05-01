export default class AvocadoLabelItemRenderer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          border-bottom: solid 1px #e0e0e0;          
          box-sizing: border-box;
          cursor: default;
          display: flex;
          flex-basis: 0;
          flex-grow: 1;
          height: 48px;
          position: relative;
        }

        p {
          color: #161616;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          padding: 0 16px 0 16px;
          text-rendering: optimizeLegibility;
          width: 100%;
        }
      </style>
      <p></p>
    `;

    // Properties
    this._data = null;
    this._label = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = shadowRoot.querySelector( 'p' );
  }

  // When things change
  _render() {
    if( this._data === null ) {
      this.$label.innerText = '';
    } else if( this._data.hasOwnProperty( 'label' ) ) {
      this.$label.innerText = this._data.label;
    } else {
      this.$label.innerText = this._data;
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
    this._upgrade( 'data' );                  
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [];
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
    this._render();
  }
}

window.customElements.define( 'adc-label-item-renderer', AvocadoLabelItemRenderer );
