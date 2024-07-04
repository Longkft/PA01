import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AniBtnPlay')
export class AniBtnPlay extends Component {
    public eff: any;
    // public eff1: any;
    protected onLoad(): void {
     
    }
    start() {
        // console.log('this.node')
        // this.scheduleOnce(()=>this.eff = tween(this.node).repeatForever(this.eff1).start(),1) ;// Bắt đầu tween
    }

    update(deltaTime: number) {
        
    }
}

