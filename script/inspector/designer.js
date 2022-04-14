import AvocadoDrawer from './drawer.js';
import AvocadoInspector from './inspector.js';

export default class AvocadoDesigner extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-basis: 0;
          flex-direction: row;
          position: relative;
          flex-grow: 1;
        }

        avocado-drawer {
          border-right: solid 1px #e1e1e1;
        }

        avocado-inspector {
          border-left: solid 1px #e1e1e1;          
        }

        div {
          align-items: center;
          background-color: white;
          display: flex;
          flex-basis: 0;
          flex-grow: 1;
          justify-content: center;
        }
      </style>
      <avocado-drawer selected-index="0"></avocado-drawer>
      <div>
        <avocado-label text="Label"></avocado-label>
        <avocado-button kind="secondary" label="Button"></avocado-button>
      </div>
      <avocado-inspector></avocado-inspector>
    `;

    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$drawer = this.shadowRoot.querySelector( 'avocado-drawer' );
    this.$drawer.source = AvocadoDesigner.MANIFEST;
    this.$inspector = this.shadowRoot.querySelector( 'avocado-inspector' );
  }

  // When things change
  _render() {;}

  // Default render
  // No attributes set
  connectedCallback() {
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

  // Arbitrary storage
  // For your convenience
  // Not used in component
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }
}

AvocadoDesigner.MANIFEST = '/manifest.json';

window.customElements.define( 'avocado-designer', AvocadoDesigner );
