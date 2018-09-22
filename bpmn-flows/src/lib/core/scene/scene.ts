import { PrimitiveCircle } from '../elements/shape/primitive.circle';
import { PrimitiveRect } from '../elements/shape/primitive.rect';
import { Shape } from '../elements/shape/shape.model';
import { SequenceFlow } from '../elements/sequence/sequence.flow.model';
import { BehaviorSubject } from 'rxjs';
import { BpmnElements } from '../elements/bpmn.elements';
import * as d3 from 'd3';
import { PrimitiveRhombus } from '../elements/shape/primitive.rhombus';
import { PrimitiveElement } from '../elements/primitive.element';
import { MultiInstanceRect } from '../elements/shape/multi.instance.rect';
import { ParticipantRect } from '../elements/shape/participant.rect';
import { LaneRect } from '../elements/shape/lane.rect';
import { SequenceFlowPath } from '../elements/sequence/sequence.flow.path';

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
    private calculateTextposition(element: PrimitiveElement) {
        let x = element.textPosition.x - element.position.x + 10;
        let y = element.textPosition.y - element.position.y + 10;
        return x + ',' + y;
    }
    private loadDefs() {
        this.svgSceneDefs.append( 'defs' ).append( 'marker' )
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
        const shapesKeys = Object.keys(this.shapes);
        for (let shapesKey of shapesKeys) {
            let shape: Shape = this.shapes[shapesKey];
            shape.element.svgElement = this.svgSceneShapes.append('g');
            if (shape.element instanceof PrimitiveCircle) {
                this.renderCircle(shape, shape.element);
            } else if (shape.element instanceof PrimitiveRect) { 
                this.renderRect( shape, shape.element);
            } else if (shape.element instanceof PrimitiveRhombus) {
                this.renderRhombus(shape, shape.element);
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
            this.renderSequence(sequence);
        }
    }
    private renderCircle( shape: Shape, element: PrimitiveCircle) {
        let name = shape.name;
        let circle = element.svgElement.append('circle');

        circle.attr('cx', '16');
        circle.attr('cy', '16');
        circle.attr('r', element.ratio);
        circle.attr('class', element.cssClass );
            
        if (name) {
            let text = element.svgElement.append('text');
            let translate = this.calculateTextposition(element);
            text.attr('class', element.textCssClass);
            text.attr('transform', 'translate('+ translate +')');
            text.text(name);
        }

        element.svgElement.attr('transform', 'translate( '+ element.position.x +', '+ element.position.y +' )')
    }
    private renderRect( shape: Shape, element: PrimitiveRect ) {
        let rec = element.svgElement.append('rect');

        rec.attr('id', shape.id);
        rec.attr('width', element.width);
        rec.attr('height', element.height);
        rec.attr('class', element.cssClass );
        
        if (element instanceof MultiInstanceRect) {
            this.renderMultiInstance(shape, element);
        } else if (element instanceof ParticipantRect || element instanceof LaneRect) {
            this.renderLane(shape, element);
        } else {
            this.renderTask(shape, element);
        }

        element.svgElement.attr('transform', 'translate( '+ element.position.x +', '+ element.position.y +' )');
    }
    private renderRhombus(shape: Shape, element: PrimitiveRhombus) {
        let polygon = element.svgElement.append('polygon');
        let foreignObject = element.svgElement.append('foreignObject').attr('y', 0).attr('x', 0);
        let div = foreignObject.append('xhtml:div')
        let name = shape.name;

        polygon.attr('points', element.points);
        polygon.attr('width', element.width);
        polygon.attr('height', element.height);
        polygon.attr('class', element.cssClass );

        if (name) {
            let text = element.svgElement.append('text');
            let translate = this.calculateTextposition(element);
            text.attr('class', element.textCssClass);
            text.attr('transform', 'translate('+ translate +')');
            text.text(name);
        }

        div.attr('style', 'float:left; width: '+ (element.width) +'px; height:'+ (element.height) +'px;')
        div.attr('class', element.icon +' '+ element.iconCssClass);       

        element.svgElement.attr('transform', 'translate( '+ element.position.x +', '+ element.position.y +' )')
    }
    private renderSequence( sequence: SequenceFlow ) {
        let sequenceElement = <SequenceFlowPath> sequence.element;
        let path = sequenceElement.svgElement.append('path');

        path.attr('id', sequence.id);
        path.attr('class', sequenceElement.cssClass );
        path.attr('d', this.calculatePath( sequence ));
        path.attr('marker-end', 'url(#marker_arrow)');

        if (sequence.name) {
            let text = sequenceElement.svgElement.append('text');
            text.attr('class', sequenceElement.textCssClass);
            text.attr('transform', 'translate(' + (sequenceElement.textPosition.x + 20) + ',' + (sequenceElement.textPosition.y + 20) +')')
            text.text(sequence.name);
        }
    }

    private renderLane(shape: Shape, element: PrimitiveRect) {
        let text = element.svgElement.append('text');
        text.attr('class', element.textCssClass);
        text.attr('x', -element.height /2);
        text.attr('y', 15);
        text.text(shape.name);
    }
    private renderMultiInstance(shape: Shape, element: PrimitiveRect) {
        let name = shape.name;
        if (name) {
            let text = element.svgElement.append('text');
            text.attr('class', element.textCssClass);
            text.text(name);
            text.attr('line-height', '1.2');
            text.attr('y', 20);
            text.attr('x', element.width/2);
        }
    }
    private renderTask(shape: Shape, element: PrimitiveRect) {
        let taskName = shape.name;

        if (element.icon) {
            element.svgElement.append('foreignObject').attr('y', 5).attr('x', 5)
            .append('xhtml:span').attr('class', element.iconCssClass + ' ' + element.icon);
        }

        if (taskName) {
            let text = element.svgElement.append('text');
            text.attr('class', element.textCssClass);
            text.text(taskName);
            text.attr('line-height', '1.2');
            text.attr('y', (element.height /2) + 5);
            text.attr('x', element.width /2);
        }
    }

    private zoomed( transform, shapes ) {
        shapes.attr('transform', transform);
    }
    private zoomEngine() {
        this.svgScene.append('rect')
        .attr('class', 'flows-io-zoom-eye')
        .call( d3.zoom()
            .scaleExtent([1 / 2, 4])
            .on('zoom', () => this.zoomed( d3.event.transform, this.svgSceneElements ))
        )
    }
}