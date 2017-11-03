import { Directive, OnInit, Input, OnChanges, ComponentRef, ViewContainerRef, Compiler, Component, NgModule, ModuleWithComponentFactories } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[compile]'
})
export class CompileDirective implements OnChanges {
  @Input() compile: string;
  @Input() compileContext: any;

  compRef: ComponentRef<any>;

  constructor(private vcRef: ViewContainerRef, private compiler: Compiler) {}

  ngOnChanges() {
    if(!this.compile) {
      if(this.compRef) {
        this.updateProperties();
        return;
      }
      throw Error('You forgot to provide template');
    }

    this.vcRef.clear();
    this.compRef = null;

    const component = this.createDynamicComponent(this.compile);
    const module = this.createDynamicModule(component);
    this.compiler.compileModuleAndAllComponentsAsync(module)
      .then((moduleWithFactories: ModuleWithComponentFactories<any>) => {
        let compFactory = moduleWithFactories.componentFactories.find(x => x.componentType === component);

        this.compRef = this.vcRef.createComponent(compFactory);
        this.updateProperties();
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateProperties() {
    for(var prop in this.compileContext) {
      this.compRef.instance[prop] = this.compileContext[prop];
    }
  }

  private createDynamicComponent (template:string) {
    @Component({
      selector: 'custom-dynamic-component',
      template: template,
    })
    class CustomDynamicComponent {}
    return CustomDynamicComponent;
  }

  private createDynamicModule (component: any) {
    @NgModule({
      // You might need other modules, providers, etc...
      // Note that whatever components you want to be able
      // to render dynamically must be known to this module
      imports: [CommonModule],
      declarations: [component]
    })
    class DynamicModule {}
    return DynamicModule;
  }
}