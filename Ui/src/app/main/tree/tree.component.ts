import { Component, Injector, OnInit } from '@angular/core';
import { data } from '../../consts/consts';
import * as d3 from "d3";
import { D3DataFamilyMember } from 'src/app/model/data';
import { FamilyGraphService } from 'src/app';
import { DataAdapter } from 'src/app/adapters/data-adapter';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  private familyId: string;
  private memberId: string;

  private _componentRendered = false;

  private svg: any;
  private _svgSelected = false;
  private simulation: any;


  private maxTitleLen = 25;
  private defaultRectWidth = 70;
  private defaultRectHeight = 70;
  private defaultRectXRadius = 10;
  private defaultRectYRadius = 10;
  private defaultTextDy = '0.35em';

  link: any;
  node: any;

  data: D3DataFamilyMember;
  root: any;

  get svgRendered(): boolean {
    console.log(this.svg);
    return this.svg.nodes().length > 0;
  }

  constructor(
    private injector: Injector, 
    private familyGraphService: FamilyGraphService,
    private activateRoute: ActivatedRoute) {
      this.familyId = activateRoute.snapshot.params['id'];
      this.memberId = activateRoute.snapshot.params['memberId'];
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    
  }

  ngAfterViewChecked(): void {
    this.svg = d3.select('svg');
    if (!this._svgSelected && this.svgRendered) {
      const width = + this.svg.attr('width');
      const height = + this.svg.attr('height');
      this.svg = d3.select('svg');

      this.svg.call(this.GetOnZoomFn());

      this._svgSelected = true;
      
      this.familyGraphService.apiFamilyGraphNodeInfoGet(this.memberId).subscribe(result => {
        this.data = this.injector.get(DataAdapter).ConcatParentsAndChilds(result);
        this.root = d3.hierarchy(this.data);
        this.simulation = d3.forceSimulation()
          .force('link', d3.forceLink().distance(d => 250))
          .force('charge', d3.forceManyBody().strength(-15).distanceMax(300))
          .force('center', d3.forceCenter(width / 2, height / 2));
        this.simulation.on('tick', () => this.OnTick());
        this.render();
      })
    }
  }

  render(): void {
    const nodes = this.flatten(this.root);
    let links = this.root.links();

    this.simulation.nodes(nodes);
    this.simulation.force('link').links(links);

    this.buildLinks(links);
    this.buildNodes(nodes);
  }

  buildLinks(links: any): void {
    this.link = this.svg
      .selectAll('.link')
      .data(links, d => d.target.id);

    this.link.exit().remove();

    const linkEnter = this.link.enter()
      .insert('line', '.node')
      .attr('class', 'link');

    this.link = linkEnter.merge(this.link);
  }

  buildNodes(nodes: any): void {
    this.node = this.svg
      .selectAll('.node')
      .data(nodes, d => d.id);

    this.node.exit().remove();


    const nodeEnter = this.node.enter()
      .append('g')
      .attr('class', 'node')
      .on('click', (evt, d) => console.log(d.id))
      .call(d3.drag()
        .on('start', (d) => this.OnDragStart(d))
        .on('drag', (d) => this.OnDrag(d))
        .on('end', (d) => this.OnDragEnd(d)));

    const title = nodeEnter
      .append('title')
      .text(d => d.data.fullname);

    const shapes = nodeEnter.append('rect')
      .attr('fill', d => this.defineFill(d))
      .attr('width', this.defaultRectWidth)
      .attr('height', this.defaultRectHeight)
      .attr('rx', this.defaultRectXRadius)
      .attr('ry', this.defaultRectYRadius);
    const texts = nodeEnter.append('text')
      .attr('y', this.defaultRectHeight / 2)
      .attr('x', this.defaultRectWidth / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', d => this.defineTextDy(d.data.fullname))
      .append('tspan')
      .text(d => this.cropFullName(d.data.fullname));
    const expandRect = nodeEnter.filter(d => d.data.isExpandable).append('rect')
      .attr('fill', d => this.defineFill(d))
      .attr('x', d => this.defaultRectWidth / 2 - 5 )
      .attr('y', d => 3)
      .attr('width', 10)
      .attr('height', 10)
      .attr('rx', 2)
      .attr('ry', 2);
    const expandText = nodeEnter.filter(d => d.data.isExpandable).append('text')
      .attr('y', 7)
      .attr('x', this.defaultRectWidth / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', d => this.defineTextDy(d.data.fullname))
      .append('tspan')
      .text(d => d.data.isCollapsed ? '+' : '-')
      .on('click', this.OnExpandClick.bind(this));

    this.node = nodeEnter.merge(this.node);
  }

  OnDrag(d: any) {
    d.subject.fx = d.x;
    d.subject.fy = d.y;
  }

  OnDragEnd(d: any) {
    if (!d.active) { this.simulation.alphaTarget(0); }
    d.subject.fx = null;
    d.subject.fy = null;
  }

  OnDragStart(d: any) {
    if (!d.active) { this.simulation.alphaTarget(0.3).restart(); }
    d.subject.fx = d.subject.x;
    d.subject.fy = d.subject.y;
  }

  OnTick() {
    this.link
      .attr('x1', d => d.source.x + this.defaultRectWidth / 2)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x + this.defaultRectWidth / 2)
      .attr('y2', d => d.target.y);

    this.node
      .attr('transform', d => `translate(${d.x},${d.y})`);
  }

  OnExpandClick(evt: any, node: any) {
    const data = node.data as  D3DataFamilyMember;
    data.isCollapsed = !data.isCollapsed;
    data.isCollapsed ? evt.srcElement.textContent = '+' : evt.srcElement.textContent = '-';
    if (!evt.defaultPrevented) {
      if (!data._children) {
      } else if (data.children) {
        data.children = node.children = [];
      } else {
        data.children = data._children;
        if (!node.children) { node.children = []; }
        data.children.forEach(c => {
          const obj = d3.hierarchy(c);
          obj.parent = node;
          node.children.push(obj);
        })
      }
    }
      
      this.render();
    // const data = node.data;
    // data.isCollapsed = !data.isCollapsed;
    // data.isCollapsed ? evt.srcElement.textContent = '+' : evt.srcElement.textContent = '-';
    // if (!evt.defaultPrevented) {
    //   if (!node.children) {
    //     this.registryService.getNodeChilds(this.fcId, node.data).subscribe(result => {
    //       result.forEach(element => {
    //         const obj = d3.hierarchy(element);
    //         obj.parent = node;
    //         obj.x = node.x;
    //         obj.y = node.y;
    //         if (!node.children) { node.children = []; }
    //         node.children.push(obj);
    //         if (!node.data.children) { node.data.children = []; }
    //         node.data.children.push(element);
    //       });
    //       this.render();
    //     });
    //   } else {
    //     node.children = null;
    //     this.render();
    //   }
    // }
  }

  GetOnZoomFn(): any {
    const localSvg = this.svg;
    return d3.zoom().on('zoom', event =>  {
      localSvg.attr('transform', event.transform);
    });
  }

  private flatten(root: any) {
    const nodes: any[] = [];
    let i = 0;
    const recurse = (node: any) => {
      if (!node.data.isCollapsed && node.children && node.children.filter(ch => ch.data.isCollapsed)) {
        node.children.forEach(recurse);
      }
      if (!node.data.id) {
        node.data.id = ++i;
      } else {
        ++i;
      }
      node.id = node.data.id;
      nodes.push(node);
    };
    recurse(root);
    return nodes;
  }

  private getNodeById(root: any, id: any): any {
    let result = null;
    if (!root) {
      return result;
    }
    if (root.data.id === id) {
      return root;
    }
    if (root.children) {
      result = this.getNodeById(root.children.find((child: any) => { 
        return (this.getNodeById(child, id) != null);
      }), id);
    }
    return result;
  }

  private cropFullName(fullname: string): string {
    if (fullname.length > this.maxTitleLen) {
      return `${fullname.substring(0, this.maxTitleLen)}...`;
    }
    return fullname;
  }

  private defineTextDy(title: string): string {
    return this.defaultTextDy;
  }

  private defineFill(node: any): string {
    switch (node.data.type) {
      // case RegistryTypeEnum.Goal:
      //   return '#fefea8';
      // case RegistryTypeEnum.Func:
      //   return '#f9ceac';
      // case RegistryTypeEnum.Objective:
      //   return '#a7e4f9';
      default:
        return '#a7e4f9';
    }
  }
}
