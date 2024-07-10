import { _decorator, Component, Node, AnimationClip, find, log, director, view, RigidBody2D, Input, ERigidBody2DType, Vec2, PolygonCollider2D } from 'cc';
import { Req } from './Req';
const { ccclass, property } = _decorator;

@ccclass('AniXuoi')
export class AniXuoi extends Component {
    @property(AnimationClip)
    public cbiNguoc: AnimationClip = null;
    @property(AnimationClip)
    public cbiXuoi: AnimationClip = null;

    nodesToHandle: Node[] = [];
    nodesToHandle12: Node[] = [];
    private rigidBodyInfo: { node: Node; rigidBody: RigidBody2D }[] = [];

    start() {
        this.loadData();
    }

    onLoad() {
        // Đăng ký sự kiện size-changed của cc.Canvas để xử lý khi resize
        const canvas = find('Canvas');
        if (canvas) {
            canvas.on(Node.EventType.SIZE_CHANGED, this.onResize, this);
        }

        // Thêm các RigidBody2D cho các node khi khởi động
        // this.nodesToHandle.forEach(node => {
        //     this.addRigidBody(node);
        // });
    }

    onDestroy() {
        // Hủy đăng ký sự kiện khi component bị hủy
        const canvas = find('Canvas');
        if (canvas) {
            canvas.off(Node.EventType.SIZE_CHANGED, this.onResize, this);
        }
    }

    // Hàm để xóa component RigidBody2D cho node và lưu thông tin
    removeRigidBody(node: Node) {
        let rb = node.getComponent(RigidBody2D);
        if (rb) {
            // Xóa RigidBody2D
            this.rigidBodyInfo.push({ node: node, rigidBody: rb });
            rb.destroy();
            // Lưu thông tin node và rigidBody vào mảng
        }
    }

    // Hàm để khôi phục lại các RigidBody2D sau khi resize
    restoreRigidBodies() {
        this.rigidBodyInfo.forEach(info => {
            const { node, rigidBody } = info;
            if (!node.isValid) return; // Kiểm tra node còn hợp lệ không trước khi thêm lại
            let name = node.name;
            let fildName = name.replace(/[0-9-]/g, '');
            // if (fildName === 'cbi') {
            let rb = node.getComponent(RigidBody2D);
            if (!rb) {
                rb = node.addComponent(RigidBody2D);
            }
            // const force = new Vec2(0, -1000); // Tăng giá trị Y để tăng lực rơi
            // rb.applyForceToCenter(force, true);
            rb = rigidBody;
            // }
            // }
        });
        // Xóa mảng lưu trữ sau khi khôi phục
        this.rigidBodyInfo = [];
    }

    isResizing = false;
    // Phương thức để xử lý khi resize màn hình
    onResize() {
        // // Xóa các RigidBody2D khi resize
        // let array = [];
        // let array1 = [];
        // let array2 = [];
        // const game = find("Canvas/Game").children;

        // game.forEach((element, index) => {
        //     let name = element.name;
        //     let filName = name.replace(/[0-9-]/g, '');
        //     if (filName === 'cbi') {
        //         array.push(element);
        //     } else if (filName === 'hold') {
        //         array1.push(element);
        //     } else {
        //         if (filName !== 'line' && filName !== 'thanhgo') {
        //             array2.push(element);
        //         }
        //     }
        // });

        // Req.instance._cbiRg = array;
        // Req.instance._holdRg = array1;
        // Req.instance._itemRg = array2;

        Req.instance._nodesToHandle1.forEach(node => {
            this.removeRigidBody(node);
        });

        this.scheduleOnce(() => {
            Req.instance._flag = false;
            if (!Req.instance._flag) {
                log('onTouchStartCanvas---------')
                Req.instance._flag = true;
                let arrayCbi = Req.instance._cbi;
                arrayCbi.forEach(element => {
                    let rb = element.getComponent(RigidBody2D);
                    if (!rb) {
                        rb = element.addComponent(RigidBody2D);
                    }
                    rb.group = 2;
                    rb.type = ERigidBody2DType.Static;
                    rb.gravityScale = 0;
                    rb.allowSleep = true;
                    rb.awakeOnLoad = true;

                    // Thêm hoặc kích hoạt lại collider
                    let collider = element.getComponent(PolygonCollider2D);
                    if (!collider) {
                        // Thêm collider nếu chưa có
                        collider = element.addComponent(PolygonCollider2D); // Thay đổi loại collider nếu cần
                    }

                    // Cập nhật hoặc kích hoạt lại collider
                    collider.enabled = false;
                    collider.enabled = true;
                })

                let arrayItem = Req.instance._item;
                arrayItem.forEach(element => {
                    let rb = element.getComponent(RigidBody2D);
                    if (!rb) {
                        rb = element.addComponent(RigidBody2D);
                    }
                    rb.group = 4;
                    rb.type = ERigidBody2DType.Static;
                    rb.gravityScale = 0;
                    rb.allowSleep = true;
                    rb.awakeOnLoad = true;

                    // Thêm hoặc kích hoạt lại collider
                    let collider = element.getComponent(PolygonCollider2D);
                    if (!collider) {
                        // Thêm collider nếu chưa có
                        collider = element.addComponent(PolygonCollider2D); // Thay đổi loại collider nếu cần
                    }

                    // Cập nhật hoặc kích hoạt lại collider
                    collider.enabled = false;
                    collider.enabled = true;
                })
            }
        }, 1);
    }

    update() {

    }

    loadData() {

        let array = [];
        let array1 = [];
        let array2 = [];
        const game = find("Canvas/Game").children;

        game.forEach((element, index) => {
            let name = element.name;
            let filName = name.replace(/[0-9-]/g, '');
            if (filName === 'cbi') {
                array.push(element);
            } else if (filName === 'hold') {
                array1.push(element);
            } else {
                if (filName !== 'line' && filName !== 'thanhgo') {
                    array2.push(element);
                }
            }
        });

        Req.instance._cbi = array;
        Req.instance._hold = array1;
        Req.instance._item = array2;
    }
}

