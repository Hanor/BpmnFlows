import { PrimitiveCircle } from '../elements/shape/primitive.circle';
import { PrimitiveRect } from '../elements/shape/primitive.rect';
import { Shape } from '../elements/shape/shape.model';
import { SequenceFlow } from '../elements/sequence/sequence.flow.model';
import { BehaviorSubject } from 'rxjs';
import { BpmnElements } from '../elements/bpmn.elements';
import * as d3 from 'd3';

export class Scene {
    private shapes;
    loaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private scene:string = '.flows-io-container';
    private sequences;
    private svgScene = null;
    private svgSceneElements = null;
    private svgSceneShapes = null;
    private svgSceneSequences = null;
    private svgSceneDefs = null;
    constructor( private bpmnElements: BpmnElements ) {
        this.sequences = this.bpmnElements.sequences;
        this.shapes = this.bpmnElements.shapes;
     }
    init() {
        this.loadSceneEngine();
        this.loadElements();
        this.loaded$.next( true );
    }
    private calculatePath( sequence: SequenceFlow ) {
        const waypoints = sequence.element.waypoints;
        let d = 'm '+ waypoints[0].x +', '+ waypoints[0].y
        for( let waypoint = 1; waypoint < waypoints.length; waypoint++ ) {
            d += 'L'+ waypoints[ waypoint ].x +','+ waypoints[ waypoint ].y
        }
        return d;
    }
    private loadDefs() {
        this.svgSceneDefs.append( 'defs' )
        .append( 'marker' )
            .attr('id', 'marker_arrow')
            .attr('markerHeight', 10)
            .attr('markerWidth', 12)
            .attr('markerUnits', 'strokeWidth')
            .attr('orient', 'auto')
            .attr('refX', 9.5)
            .attr('refY', 10)
            .attr( 'viewBox', '0 0 22 22' )
            .append( 'path' )
                .attr( 'd', 'M 1 5 L 11 10 L 1 15 Z' )
                .attr( 'class', 'flows-io-marker' )
    }
    private loadElements() {
        this.loadDefs();
        this.loadShapes();
        this.loadSequences();
    }
    private loadShapes() {
        const shapesKeys = Object.keys( this.shapes );
        for( let shapesKey of shapesKeys ) {
            let shape: Shape = this.shapes[ shapesKey ];
            shape.element.svgElement = this.svgSceneShapes.append('g');
            if ( shape.element instanceof PrimitiveCircle ) {
                this.renderCircle( shape.element, shape );
            } else if ( shape.element instanceof PrimitiveRect ) {
                this.renderRect( shape.element, shape );
            }
        }
    }
    private loadSceneEngine() {
        this.svgScene = d3.select( this.scene ).append( 'svg' );
        this.svgScene.attr('class', 'flows-io-svg-scene');
        this.svgSceneElements = this.svgScene.append( 'g' );
        this.svgSceneDefs = this.svgSceneElements.append( 'g' );
        this.svgSceneSequences = this.svgSceneElements.append( 'g' );
        this.svgSceneShapes = this.svgSceneElements.append( 'g' );
        this.zoomEngine();
    }
    private loadSequences() {
        const sequencesKeys = Object.keys( this.sequences );
        for( let sequenceKey of sequencesKeys ) {
            let sequence : SequenceFlow =  this.sequences[ sequenceKey ];
            sequence.element.svgElement = this.svgSceneSequences.append('g');
            this.renderSequence( sequence );
        }
    }
    private renderCircle( element: PrimitiveCircle, shape: Shape ) {
        element.svgElement
        .attr('transform', 'translate( '+ element.position.x +', '+ element.position.y +' )')
        .append('circle')  
            .attr('cx', '16')
            .attr('cy', '16')
            .attr('r', element.ratio)
            .attr('class', element.cssClass );
    }
    private renderAlternatives( name:string, element: PrimitiveRect ) {
        // todo migrar estes items para svg nativo!
        // todo change this forms to be native svg!
        const foreign = element.svgElement.append('foreignObject')
        .attr('x', element.position.x)
        .attr('y', element.position.y)

        const div = foreign.append('xhtml:div')
        .attr('style', 'float:left; width: '+ (element.width) +'px; height:'+ (element.height) +'px')
        .attr( 'class', 'flows-io-shadow' )

        if ( element.icon ) {
            div.append('xhtml:div')
            .attr('style', 'float:left; width: '+ (element.width) +'px; padding-top: 2px; padding-left:5px; height:10px;')
            .append('span')
                .attr('class', element.icon +' '+ element.iconCssClass)
                .attr('style', 'float:left; font-size:14px')
        }

        if ( name ) {
            div.append('xhtml:div')
            .attr('style', 'float:left; width: '+ (element.width) +'px; height:'+ (element.height - 20) +'px;')
            .attr('class', element.textCssClass)
            .text( name )
        }
    }
    private renderRect( element: PrimitiveRect, shape: Shape ) {
        element.svgElement.append('rect')
        .attr('x', element.position.x)
        .attr('y', element.position.y)
        .attr('rx', element.rx)
        .attr('ry', element.ry)
        .attr('width', element.width)
        .attr('height', element.height)
        .attr('class', element.cssClass );
        this.renderAlternatives( shape.name, element );
    }
    private renderSequence( sequence: SequenceFlow ) {
        sequence.element.svgElement.append('path')
        .attr('class', sequence.element.cssClass )
        .attr('d', this.calculatePath( sequence ))
        .attr('marker-end', 'url(#marker_arrow)');
    }
    private zoomed( transform, shapes ) {
        shapes.attr('transform', transform);
    }
    private zoomEngine() {
        this.svgScene.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('class', 'flows-io-zoom-eye')
        .call( d3.zoom()
            .scaleExtent([1 / 2, 4])
            .on('zoom', () => this.zoomed( d3.event.transform, this.svgSceneElements ))
        )
    }
}