import { BugItem, SectionSnippet } from '../types';
import rawLuaScript from '../../roblox.txt?raw';

export const LUA_FIXED_SCRIPT = rawLuaScript;

export const BUGS_FIX_LIST: BugItem[] = [
  {
    id: 'bug-registers',
    title: 'Out of local registers (>200 limit) compiler crash',
    badge: 'Compiler Fatal',
    severity: 'Critical',
    oldIssue: 'Lỗi :3078: Out of local registers when trying to allocate serverHop: exceeded limit 200. Trong trình biên dịch Luau (Roblox bytecode), một hàm/scope chỉ có thể chứa tối đa 200 thanh ghi cục bộ (local variables). Script cũ khai báo hàng trăm biến local rời rạc ở root chunk dẫn đến tràn bộ nhớ thanh ghi!',
    fixedSolution: 'Tổ chức toàn bộ biến vào các Namespace Table thống nhất: S (Services), Config (Hằng số), State (Trạng thái runtime), Tracker (Conns & Objects), Utils (Hàm phụ trợ), Controls (UI Builder), Logic (Game logic), Server (Server tools). Số lượng biến local ở root giảm từ 220+ xuống chỉ còn 14 biến!',
    codeDiffOld: `local Players = game:GetService("Players")
local UIS = game:GetService("UserInputService")
local TweenS = game:GetService("TweenService")
local RunS = game:GetService("RunService")
-- ... hàng trăm biến local rời rạc ...
local function serverHop() -- CRASH: Exceeded limit 200!`,
    codeDiffNew: `local S = {
    Players = game:GetService("Players"),
    UIS = game:GetService("UserInputService"),
    -- Gom nhóm 100% services vào 1 bảng
}
local State = { player = {}, combat = {}, target = {}, visuals = {} }
local Server = {}
function Server.serverHop() -- ✅ Tuyệt đối không tràn thanh ghi!`,
  },
  {
    id: 'bug-tpwalk',
    title: 'TPWalk không hoạt động hoặc bị giật lùi (Rubberband)',
    badge: 'Movement Logic',
    severity: 'High',
    oldIssue: 'Code cũ dùng: rootPart.CFrame = rootPart.CFrame + (hum.MoveDirection * speedMultiplier) mà không triệt tiêu vận tốc vật lý AssemblyLinearVelocity hoặc điều hòa Delta Time (dt), khiến hệ thống vật lý Roblox kéo ngược nhân vật lại và bị anti-cheat gắn cờ di chuyển dị thường.',
    fixedSolution: 'Thêm cơ chế triệt tiêu lực đẩy quán tính ngang `AssemblyLinearVelocity = Vector3.new(0, vel.Y, 0)` kết hợp `MoveDirection * (speed * 22 * dt)`, cho phép lướt CFrame êm mượt 100% không giật lag và bypass anti-cheat WalkSpeed.',
    codeDiffOld: `local tpwalkConn = RunS.Heartbeat:Connect(function(dt)
    if playerState.tpwalk then
        rootPart.CFrame = rootPart.CFrame + (hum.MoveDirection * speedMultiplier)
    end
end)`,
    codeDiffNew: `local tpwalkConn = S.RunS.Heartbeat:Connect(function(dt)
    if State.player.tpwalk and not State.player.fly then
        local hum = Utils.getHumanoid()
        local rootPart = Utils.getRootPart()
        if hum and rootPart and hum.MoveDirection.Magnitude > 0 then
            rootPart.AssemblyLinearVelocity = Vector3.new(0, rootPart.AssemblyLinearVelocity.Y, 0)
            rootPart.CFrame = rootPart.CFrame + (hum.MoveDirection * (State.player.tpwalkSpeed * 22 * dt))
        end
    end
end)`,
  },
  {
    id: 'bug-infjump',
    title: 'Infinity Jump (Nhảy vô tận) không nhận lệnh trên không',
    badge: 'Physics Logic',
    severity: 'High',
    oldIssue: 'Code cũ chỉ gọi `hum:ChangeState(Enum.HumanoidStateType.Jumping)`. Khi nhân vật đang ở trạng thái Freefall (rơi tự do trên không), controller mặc định của Roblox bỏ qua lệnh ChangeState này khiến không thể nhảy liên tục trên không trung.',
    fixedSolution: 'Kết hợp đồng thời ChangeState sang Jumping VÀ bơm trực tiếp một vector xung lực thẳng đứng vào `AssemblyLinearVelocity.Y = JumpPower`, giúp nhảy vô tận bất kể đang rơi ở bất kỳ độ cao nào trong mọi tựa game.',
    codeDiffOld: `local infJumpConn = UIS.JumpRequest:Connect(function()
    if playerState.infjump then
        hum:ChangeState(Enum.HumanoidStateType.Jumping) -- Bị Roblox hủy khi ở Freefall
    end
end)`,
    codeDiffNew: `local infJumpConn = S.UIS.JumpRequest:Connect(function()
    if State.player.infjump then
        local hum = Utils.getHumanoid()
        local rootPart = Utils.getRootPart()
        if hum and rootPart and hum.Health > 0 then
            hum:ChangeState(Enum.HumanoidStateType.Jumping)
            local jPower = hum.JumpPower > 0 and hum.JumpPower or 50
            rootPart.AssemblyLinearVelocity = Vector3.new(rootPart.AssemblyLinearVelocity.X, jPower, rootPart.AssemblyLinearVelocity.Z)
        end
    end
end)`,
  },
  {
    id: 'bug-head-sit',
    title: 'Head Sit sai logic (Ngồi đầu người chơi khác bị rớt/lệch)',
    badge: 'Targeting Logic',
    severity: 'Medium',
    oldIssue: 'Code cũ khởi tạo 1 object Seat tạm trong workspace rồi dùng WeldConstraint gắn vào đầu mục tiêu và gọi `seat:Sit(myHum)`. Do client không có Network Ownership trên nhân vật đối phương, Seat sẽ bị tụt lại phía sau hoặc văng ra khi mục tiêu di chuyển!',
    fixedSolution: 'Thay thế hoàn toàn Seat ảo bằng cơ chế CFrame Lock trực tiếp trong vòng lặp Heartbeat: Đặt `Humanoid.Sit = true`, triệt tiêu vận tốc rơi và khóa tọa độ nhân vật chuẩn xác 1.8 studs phía trên đầu mục tiêu theo thời gian thực.',
    codeDiffOld: `local function startHeadSit()
    local seat = Instance.new("Seat") -- Sinh Seat ảo gây desync vật lý
    local weld = Instance.new("WeldConstraint")
    seat:Sit(myHum)
end`,
    codeDiffNew: `local headSitConn = S.RunS.Heartbeat:Connect(function()
    if State.target.loopHeadSit and State.target.selectedPlayer then
        local myRoot = Utils.getRootPart()
        local myHum = Utils.getHumanoid()
        local tChar = State.target.selectedPlayer.Character
        local tHead = tChar and (tChar:FindFirstChild("Head") or tChar:FindFirstChild("HumanoidRootPart"))
        if myRoot and myHum and tHead then
            myHum.Sit = true
            myRoot.AssemblyLinearVelocity = Vector3.zero
            myRoot.CFrame = tHead.CFrame * CFrame.new(0, 1.8, 0)
        end
    end
end)`,
  },
  {
    id: 'bug-ghost-mode',
    title: 'Chế độ ma (Ghost Mode) không tàng hình/xuyên vật thể hoàn chỉnh',
    badge: 'Visual & Physics',
    severity: 'Medium',
    oldIssue: 'Code cũ chỉ gán sơ sài `p.Transparency = 0.5` cho BasePart, không lưu lại trạng thái độ trong suốt gốc để khôi phục (làm hỏng decal mặt/phụ kiện), đồng thời không tắt va chạm các bộ phận khiến nhân vật vẫn bị kẹt tường.',
    fixedSolution: 'Tạo cơ chế Phantom Mode chuyên nghiệp: Lưu bản đồ `ghostOriginalTransp` để khôi phục chính xác 100% khi tắt, áp dụng độ mờ 65% trên toàn bộ Decal/Accessory, và tích hợp loop vô hiệu hóa va chạm `CanCollide = false` trên các khớp xương.',
    codeDiffOld: `for _, p in ipairs(player.Character:GetDescendants()) do
    if p:IsA("BasePart") then p.Transparency = on and 0.5 or 0 end -- Mất giá trị gốc
end`,
    codeDiffNew: `function Logic.setGhostMode(enable)
    if enable then
        State.player.ghostOriginalTransp = {}
        for _, part in ipairs(char:GetDescendants()) do
            if part:IsA("BasePart") or part:IsA("Decal") then
                State.player.ghostOriginalTransp[part] = part.Transparency
                part.Transparency = 0.65
                if part:IsA("BasePart") then part.CanCollide = false end
            end
        end
    else
        -- Khôi phục 100% đúng màu và độ mờ ban đầu
    end
end`,
  },
  {
    id: 'bug-memory-distribution',
    title: 'Phân bổ tài nguyên & Dọn dẹp bộ nhớ (Clean Disposals)',
    badge: 'Optimization',
    severity: 'Medium',
    oldIssue: 'Khi bấm Kill UI hoặc Rejoin, các kết nối `RunService.Heartbeat`, `Stepped`, `JumpRequest`, Highlight ESP và BlurEffect trong Lighting không được gỡ bỏ triệt để, gây rò rỉ bộ nhớ (Memory Leak) và tụt FPS.',
    fixedSolution: 'Hệ thống Tracker tự động gom tất cả Connection và Spawned Objects vào danh sách quản lý. Khi tắt UI hoặc Kill UI, toàn bộ sự kiện được ngắt kết nối an toàn (`Disconnect`), xóa sạch Blur và đưa các chỉ số vật lý về mặc định.',
    codeDiffOld: `-- Rải rác connections khắp nơi không có mảng quản lý`,
    codeDiffNew: `local Tracker = { connections = {}, spawned = {} }
local function registerConn(conn)
    table.insert(Tracker.connections, conn)
    return conn
end
-- Khi Kill UI: Duyệt mảng Tracker và giải phóng 100% tài nguyên`,
  },
];

export const SCRIPT_SECTIONS: SectionSnippet[] = [
  {
    id: 'namespaces',
    name: 'Namespaces & Services',
    icon: 'Boxes',
    lineRange: 'L1 - L120',
    description: 'Bảng quản lý Services, Cấu hình màu sắc, Bảng State và Tracker giúp giảm số thanh ghi local từ >200 xuống 14.',
  },
  {
    id: 'player-movement',
    name: 'Player & Movement Fixes',
    icon: 'Zap',
    lineRange: 'L121 - L480',
    description: 'Fix logic TPWalk CFrame, Infinite Jump xung lực thẳng đứng, Fly WASD và Chế độ ma (Ghost Mode).',
  },
  {
    id: 'combat-aimbot',
    name: 'Combat & Orca Aimbot',
    icon: 'Crosshair',
    lineRange: 'L481 - L890',
    description: 'Aimbot Camera Lock chống giật, Sticky Target, Hitbox Expander, Kill Aura và Spinbot chống ngắm.',
  },
  {
    id: 'target-waypoints',
    name: 'Target & Head Sit',
    icon: 'Target',
    lineRange: 'L891 - L1340',
    description: 'Fix Head Sit CFrame, Click 3D Target nhân vật, Highlight Target và hệ thống Waypoints.',
  },
  {
    id: 'visuals-esp',
    name: 'Visuals & Quái/Entity ESP',
    icon: 'Eye',
    lineRange: 'L1341 - L1820',
    description: 'Player ESP Chams, Entity ESP cho quái/mobs/boss, Dynamic Overhead HP Bar và Shaders.',
  },
  {
    id: 'server-tools',
    name: 'Server Hop & Optimizers',
    icon: 'Globe',
    lineRange: 'L1821 - L2314',
    description: 'Server Hop không còn lỗi limit 200, Rejoin, FPS Boost dọn dẹp lag và Kill UI an toàn.',
  },
];
