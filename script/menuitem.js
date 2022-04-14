export default class AvocadoMenuItem extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        button {
          background: none;
          background-position: left 12px center;
          background-repeat: no-repeat;
          background-size: 18px;
          border: none;
          border-left: solid 4px transparent;
          box-sizing: border-box;
          color: #f4f4f4;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          height: 32px;
          margin: 0;
          outline: none;
          padding: 0 0 0 44px;
          text-align: left;
          width: 100%;
        }        

        button.selected {
          background-color: #4c4c4c;
          border-left: solid 4px #0f62fe;          
        }

        button:hover {
          background-color: #4d4d4d;          
        }

        button.branch {
          cursor: default;
        }

        button.branch:hover {
          background-color: transparent;
        }

        button.leaf {
          font-weight: 400;
          padding-left: 60px;
        }
      </style>
      <button></button>
      <slot></slot>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = shadowRoot.querySelector( 'button' );
    this.$slot = shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', ( evt ) => this.doSlot( evt ) );
  }

  // Children count changed
  // Fresh render
  doSlot( evt ) {
    this._render();
  }

  // When things change
  _render() {
    // Host
    this.style.display = this.hidden === true ? 'none' : '';        
    this.style.visibility = this.concealed === true ? 'hidden' : '';  
    
    // Children
    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].leaf = true;
    }

    // Branch or leaf
    if( this.children.length > 0 ) {
      this.$label.classList.add( 'branch' );
    } else {
      this.$label.classList.remove( 'branch' );
    }

    // Leaf
    if( this.leaf ) {
      this.$label.classList.add( 'leaf' );
    } else {
      this.$label.classList.remove( 'leaf' );
    }

    // Selection
    if( this.selected ) {
      this.$label.classList.add( 'selected' );
    } else {
      this.$label.classList.remove( 'selected' );
    }

    // Icon
    this.$label.style.backgroundImage = this.icon === null ? '' : `url( ${this.icon} )`;

    // Content
    this.$label.innerText = this.label;
  }

  // Default render
  // No attributes set
  connectedCallback() {
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'icon',
      'label',
      'leaf',
      'selected'
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

  get icon() {
    if( this.hasAttribute( 'icon' ) ) {
      return this.getAttribute( 'icon' );
    }

    return null;
  }

  set icon( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon', value );
    } else {
      this.removeAttribute( 'icon' );
    }
  }

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  get index() {
    if( this.hasAttribute( 'index' ) ) {
      return parseInt( this.getAttribute( 'index' ) );
    }

    return null;
  }

  set index( value ) {
    if( value !== null ) {
      this.setAttribute( 'index', value );
    } else {
      this.removeAttribute( 'index' );
    }
  }   

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }  

  get leaf() {
    return this.hasAttribute( 'leaf' );
  }

  set leaf( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'leaf' );
      } else {
        this.setAttribute( 'leaf', '' );
      }
    } else {
      this.removeAttribute( 'leaf' );
    }
  }
  
  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
    }
  }  
}

window.customElements.define( 'avocado-menuitem', AvocadoMenuItem );
