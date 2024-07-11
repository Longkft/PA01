import { _decorator, Component, Node, AnimationClip, find, log, director, view, RigidBody2D, Input, ERigidBody2DType, Vec2, PolygonCollider2D, tween, Vec3 } from 'cc';
import { AdManager } from './AdManager';
import { Req } from './Req';
import super_html_playable from './super_html_playable';
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

        view.on("canvas-resize", () => {
            this.resize();
        });
        this.resize();

        this.effectNo(find('Canvas/google-play-badge'));

        // Đăng ký sự kiện size-changed của cc.Canvas để xử lý khi resize
        const canvas = find('Canvas');
        if (canvas) {
            canvas.on(Node.EventType.SIZE_CHANGED, this.onResize, this);
        }
    }

    update() {
        if (Req.instance._piece === 11) {
            if (!Req.instance._endGame) {
                Req.instance._endGame = true;
                find('Canvas').getComponent(AniXuoi).EventNetWork();
                find('Canvas/Ads').active = true;
                find('Canvas').getComponent(AdManager).openAdUrl();
            }
        }
    }

    resize() {
        const screenSize = view.getVisibleSize();

        const cVas = find('Canvas');
        const title = find('Canvas/titleee');
        const icon = find('Canvas/icon');
        const bt = find('Canvas/google-play-badge');
        // const bt1 = find('Canvas/google-play-badge-001');

        if (screenSize.x > screenSize.y) {
            icon.active = true;
            // bt.active = false;
            // this.effectNo(bt1);
        } else {
            icon.active = false;
            // bt1.active = false;
            // this.effectNo(bt);
        }
        // bt1.active = false;
        // this.effectNo(bt);
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

    EventNetWork() {
        super_html_playable.game_end();
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

    effectNo(effectNode: Node, check?: boolean) {
        const x = effectNode.scale.x;
        const y = effectNode.scale.y;
        let eff = tween()
            .to(0.4, { scale: new Vec3(x + 0.3, y + 0.3, 1) })
            .to(0.5, { scale: new Vec3(x + 0.1, y + 0.1, 1) })


        check ? eff.stop() : tween(effectNode)
            // .delay(0.2)
            .repeatForever(eff)
            .start();;
    }
}

