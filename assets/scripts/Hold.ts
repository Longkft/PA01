import { _decorator, Component, Node, Input, log, tween, Vec3 } from 'cc';
import { Req } from './Req';
import { Wood } from './Wood';
const { ccclass, property } = _decorator;

@ccclass('Hold')
export class Hold extends Component {

    start() {
        this.registerTouch();
    }

    update(deltaTime: number) {

    }

    registerTouch() {
        this.node.on(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    destroyTouch() {
        this.node.off(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    touchStart() {
        if (Req.instance._woodNode) {
            log('touchStart-hold')

            let posThisNode = this.node.position;

            tween(Req.instance._woodNode).tag(2)
                .to(0.3, { position: new Vec3(posThisNode.x, posThisNode.y + 45, posThisNode.z) })
                .call(() => {
                    const woodNode = Req.instance._woodNode;
                    const woodNodeComponent = woodNode.getComponent(Wood);
                    woodNodeComponent.playAni(woodNode, 1);
                    woodNodeComponent.tweenWood(woodNode, -45);
                    woodNodeComponent.xuoi = false;
                    Req.instance._woodNode = null;
                })
                .start();
        }
    }


}

