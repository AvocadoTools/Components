export default class AvocadoInspector extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        @import url( 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap' );

        :host {
          background-color: #f5f5f5;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          width: 375px;
        }

        div {
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
          padding: 16px;
        }

        label {
          color: #6e6e6e;
          font-family: 'Source Sans Pro', sans-serif;
          font-size: 11px;
          font-weight: 600;
          line-height: 34px;
          margin: 0;
          padding: 0 16px 0 16px;
          text-transform: uppercase;
        }

        table {
          background-color: #ffffff; 
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 4px; 
          border: solid 1px #e1e1e1;
          margin: 0;
          padding: 0;
          width: 100%;
        }

        td {
          color: #4b4b4b;
          line-height: 50px;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'Source Sans Pro', sans-serif;
          font-size: 14px;
          margin: 0;
          padding: 0 16px 0 16px;
        }

        td:first-of-type {
          border-right: solid 1px #e1e1e1;
          cursor: default;
        }

        td:last-of-type {
          cursor: pointer;
        }

        tr {
          border-bottom: solid 1px #e1e1e1;
          display: flex;
          flex-direction: row;
          padding: 0;
          margin: 0;
        }

        tr:last-of-type {
          border-bottom: none;
        }
      </style>
      <div>
        <label>Attributes</label>      
        <table>
          <tr>
            <td>color</td>
            <td>#161616</td>
          </tr>
          <tr>
            <td>cursor</td>
            <td>pointer</td>
          </tr>          
        </table>
        <label style="margin-top: 16px;">Styles</label>      
        <table>
          <tr>
            <td>--background-color</td>
            <td>#161616</td>
          </tr>
          <tr>
            <td>--cursor</td>
            <td>pointer</td>
          </tr>          
        </table>        
      </div>
      <!--
      <h3>Description</h3>
      <p></p>
      -->
    `;

    // Properties
    this._data = [];
    this._index = 0;

    // Events
    this.doPropertyOut = this.doPropertyOut.bind( this );
    this.doPropertyOver = this.doPropertyOver.bind( this );

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$components = shadowRoot.querySelector( 'select' );
    this.$components.addEventListener( 'change', ( evt ) => this.doChange( evt ) );
    this.$description = shadowRoot.querySelector( 'p' );
  }

  // Component selection changed
  // Track index
  // Dispatch change
  // Render
  doChange( evt ) {
    this._index = this.$components.selectedIndex;

    this.dispatchEvent( new CustomEvent( 'change', {
      detail: this.data[this._index]
    } ) );

    this._render();
  }

  // Property description
  doPropertyOut( evt ) {
    this.$description.innerText = this.data[this._index].description;
  }

  doPropertyOver( evt ) {
    this.$description.innerText = evt.currentTarget.description;
  }

  // When tnings change
  _render() {
    // For initial render of component listing
    if( this.$components.options.length === 0 ) {
      // Remove any previous listing
      while( this.$components.children.length > 0 ) {
        this.$components.children[0].remove();
      }
  
      // Populate component list options
      for( let d = 0; d < this._data.length; d++ ) {
        const option = document.createElement( 'option' );
        option.setAttribute( 'data-index', d );
        option.innerText = this._data[d].name;
        this.$components.appendChild( option );    
      }
    }

    // Clean up property events
    // Remove property for next render
    while( this.children.length > 0 ) {
      this.children[0].removeEventListener( 'mouseover', this.doPropertyOver );
      this.children[0].removeEventListener( 'mouseout', this.doPropertyOut );      
      this.children[0].remove();
    }

    // No components to render
    if( this.data.length === 0 ) return;

    const sections = ['attributes', 'properties', 'styles', 'parts', 'slots', 'events']

    // Fill out properties for given component
    // Includes hover for dynamic descriptions
    for( let s = 0; s < sections.length; s++ ) {
      if( !this._data[this._index].hasOwnProperty( sections[s] ) ) break;
      for( let p = 0; p < this._data[this._index][sections[s]].length; p++ ) {
        const property = document.createElement( 'avocado-property' );
        property.addEventListener( 'mouseover', this.doPropertyOver );
        property.addEventListener( 'mouseout', this.doPropertyOut );      
        property.data = this._data[this._index][sections[s]][p];
        property.label = this._data[this._index][sections[s]][p].name;
        property.description = this._data[this._index][sections[s]][p].description;
        property.property = this._data[this._index][sections[s]][p].property;      
        property.type = this._data[this._index][sections[s]][p].type;
        property.value = this._data[this._index][sections[s]][p].value;
        property.slot = sections[s];
        this.appendChild( property );        
      }
    }

    // Populate description field
    this.$description.innerText = this._data[this._index].description;
  }

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

  // Data property
  // Complex data structure of components
  get data() {
    return this._data;
  }

  // Clone array
  // Reset selected component index
  // Render
  set data( value ) {
    this._data = [... value];
    this._index = 0;
    this._render();
  }
}

window.customElements.define( 'avocado-inspector', AvocadoInspector );
