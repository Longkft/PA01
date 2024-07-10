import { _decorator, Component, Node, PolygonCollider2D, Contact2DType, log } from 'cc';
import { Req } from './Req';
const { ccclass, property } = _decorator;

@ccclass('Wall')
export class Wall extends Component {
    start() {
        let collider = this.getComponent(PolygonCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: PolygonCollider2D, otherCollider: PolygonCollider2D, contact: PolygonCollider2D | null) {
        log('onBeginContact')
        // if (selfCollider.group == 16 && otherCollider.group == 4) {
        Req.instance._piece++;
        log('Req.instance._piece: ', Req.instance._piece);
        // }
    }
}

