import { Shape } from './shape/shape.model';
import { SequenceFlow } from './sequence/sequence.flow.model';
import { PrimitiveRect } from './shape/primitive.rect';
import { PrimitiveCircle } from './shape/primitive.circle';
import { PrimitiveSequence } from './sequence/primitive.sequence';

export class BpmnElements {
    shapes = {};
    sequences = {};
    
    bindElementAndSequence() {
        const sequenceKeys = Object.keys( this.sequences );
        for( const sequenceKey of sequenceKeys) {
            const sequence:SequenceFlow = this.sequences[ sequenceKey ];
            sequence.source.out.push( sequence );
            sequence.target.in.push( sequence );
        }
    }

    createElement( xmlElement ): Shape {
        const shape = new Shape( xmlElement );
        this.shapes[ shape.id ] = shape;
        return shape;
    }

    createSequence( id, source, target ) {
        const sourceShape = this.shapes[ source ];
        const targetShape = this.shapes[ target ];
        const sequence = new SequenceFlow( id, sourceShape, targetShape );
        this.sequences[ id ] = sequence;
    }

    setSequenceSVGAttributes( id, attributes ) {
        const sequence: SequenceFlow = this.sequences[ id ];
        const element: PrimitiveSequence = sequence.element;
        element.waypoints.push( attributes.waypoints );
    }
    setShapeSVGAttributes( id, attributes ) {
        const shape:Shape = this.shapes[ id ];
        if ( shape.element instanceof PrimitiveRect ) {
            const element: PrimitiveRect = shape.element;
            element.width = attributes.width;
            element.height = attributes.height;
            element.position = attributes.position;
        }
        else if ( shape.element instanceof PrimitiveCircle ) {
            const element: PrimitiveCircle = shape.element;
            element.ratio = ((attributes.width + attributes.height) /4);
            element.position = attributes.position;
        } else {
            console.log( shape.element );
            console.log( "Shape não conhecida!" );
        }
    }
}