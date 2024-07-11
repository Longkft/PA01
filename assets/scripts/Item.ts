import { _decorator, Component, Node, view, log, find } from 'cc';
import { AniXuoi } from './AniXuoi';
import { Req } from './Req';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    flag: boolean = false;

    start() {

    }

    update(deltaTime: number) {
        this.checkIfFallingOffScreen(this.node);
    }

    hasFallenOffScreen: boolean = false;
    checkIfFallingOffScreen(node: Node) {
        // Lấy vị trí thế giới hiện tại của node
        let nodeWorldPos = node.getWorldPosition();

        // Lấy kích thước màn hình
        let screenSize = view.getVisibleSize();

        // Kiểm tra nếu node đã rơi hết màn hình
        if (nodeWorldPos.y < -screenSize.height / 2) {
            if (!this.hasFallenOffScreen) {
                // Nếu node rơi hết màn hình và chưa được tính điểm trước đó
                this.hasFallenOffScreen = true;

                // Tăng biến điểm lên 1
                Req.instance._piece++;
            }
        }
    }
}

