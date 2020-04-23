const CBOPCODE = [
    //RLC B
    //#0x00:
    function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerB > 0x7F);
        gb.registerB = ((gb.registerB << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerB == 0);
    }
    //RLC C
    //#0x01:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerC > 0x7F);
        gb.registerC = ((gb.registerC << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerC == 0);
    }
    //RLC D
    //#0x02:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerD > 0x7F);
        gb.registerD = ((gb.registerD << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerD == 0);
    }
    //RLC E
    //#0x03:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerE > 0x7F);
        gb.registerE = ((gb.registerE << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerE == 0);
    }
    //RLC H
    //#0x04:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registersHL > 0x7FFF);
        gb.registersHL = ((gb.registersHL << 1) & 0xFE00) | ((gb.FCarry) ? 0x100 : 0) | (gb.registersHL & 0xFF);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registersHL < 0x100);
    }
    //RLC L
    //#0x05:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registersHL & 0x80) == 0x80);
        gb.registersHL = (gb.registersHL & 0xFF00) | ((gb.registersHL << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0xFF) == 0);
    }
    //RLC (HL)
    //#0x06:
    , function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FCarry = (temp_var > 0x7F);
        temp_var = ((temp_var << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (temp_var == 0);
    }
    //RLC A
    //#0x07:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerA > 0x7F);
        gb.registerA = ((gb.registerA << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerA == 0);
    }
    //RRC B
    //#0x08:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerB & 0x01) == 0x01);
        gb.registerB = ((gb.FCarry) ? 0x80 : 0) | (gb.registerB >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerB == 0);
    }
    //RRC C
    //#0x09:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerC & 0x01) == 0x01);
        gb.registerC = ((gb.FCarry) ? 0x80 : 0) | (gb.registerC >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerC == 0);
    }
    //RRC D
    //#0x0A:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerD & 0x01) == 0x01);
        gb.registerD = ((gb.FCarry) ? 0x80 : 0) | (gb.registerD >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerD == 0);
    }
    //RRC E
    //#0x0B:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerE & 0x01) == 0x01);
        gb.registerE = ((gb.FCarry) ? 0x80 : 0) | (gb.registerE >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerE == 0);
    }
    //RRC H
    //#0x0C:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registersHL & 0x0100) == 0x0100);
        gb.registersHL = ((gb.FCarry) ? 0x8000 : 0) | ((gb.registersHL >> 1) & 0xFF00) | (gb.registersHL & 0xFF);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registersHL < 0x100);
    }
    //RRC L
    //#0x0D:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registersHL & 0x01) == 0x01);
        gb.registersHL = (gb.registersHL & 0xFF00) | ((gb.FCarry) ? 0x80 : 0) | ((gb.registersHL & 0xFF) >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0xFF) == 0);
    }
    //RRC (HL)
    //#0x0E:
    , function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FCarry = ((temp_var & 0x01) == 0x01);
        temp_var = ((gb.FCarry) ? 0x80 : 0) | (temp_var >> 1);
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (temp_var == 0);
    }
    //RRC A
    //#0x0F:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerA & 0x01) == 0x01);
        gb.registerA = ((gb.FCarry) ? 0x80 : 0) | (gb.registerA >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerA == 0);
    }
    //RL B
    //#0x10:
    , function (gb: GameBoyCore) {
        var newFCarry = (gb.registerB > 0x7F);
        gb.registerB = ((gb.registerB << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerB == 0);
    }
    //RL C
    //#0x11:
    , function (gb: GameBoyCore) {
        var newFCarry = (gb.registerC > 0x7F);
        gb.registerC = ((gb.registerC << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerC == 0);
    }
    //RL D
    //#0x12:
    , function (gb: GameBoyCore) {
        var newFCarry = (gb.registerD > 0x7F);
        gb.registerD = ((gb.registerD << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerD == 0);
    }
    //RL E
    //#0x13:
    , function (gb: GameBoyCore) {
        var newFCarry = (gb.registerE > 0x7F);
        gb.registerE = ((gb.registerE << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerE == 0);
    }
    //RL H
    //#0x14:
    , function (gb: GameBoyCore) {
        var newFCarry = (gb.registersHL > 0x7FFF);
        gb.registersHL = ((gb.registersHL << 1) & 0xFE00) | ((gb.FCarry) ? 0x100 : 0) | (gb.registersHL & 0xFF);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registersHL < 0x100);
    }
    //RL L
    //#0x15:
    , function (gb: GameBoyCore) {
        var newFCarry = ((gb.registersHL & 0x80) == 0x80);
        gb.registersHL = (gb.registersHL & 0xFF00) | ((gb.registersHL << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0xFF) == 0);
    }
    //RL (HL)
    //#0x16:
    , function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        var newFCarry = (temp_var > 0x7F);
        temp_var = ((temp_var << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FCarry = newFCarry;
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (temp_var == 0);
    }
    //RL A
    //#0x17:
    , function (gb: GameBoyCore) {
        var newFCarry = (gb.registerA > 0x7F);
        gb.registerA = ((gb.registerA << 1) & 0xFF) | ((gb.FCarry) ? 1 : 0);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerA == 0);
    }
    //RR B
    //#0x18:
    , function (gb: GameBoyCore) {
        var newFCarry = ((gb.registerB & 0x01) == 0x01);
        gb.registerB = ((gb.FCarry) ? 0x80 : 0) | (gb.registerB >> 1);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerB == 0);
    }
    //RR C
    //#0x19:
    , function (gb: GameBoyCore) {
        var newFCarry = ((gb.registerC & 0x01) == 0x01);
        gb.registerC = ((gb.FCarry) ? 0x80 : 0) | (gb.registerC >> 1);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerC == 0);
    }
    //RR D
    //#0x1A:
    , function (gb: GameBoyCore) {
        var newFCarry = ((gb.registerD & 0x01) == 0x01);
        gb.registerD = ((gb.FCarry) ? 0x80 : 0) | (gb.registerD >> 1);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerD == 0);
    }
    //RR E
    //#0x1B:
    , function (gb: GameBoyCore) {
        var newFCarry = ((gb.registerE & 0x01) == 0x01);
        gb.registerE = ((gb.FCarry) ? 0x80 : 0) | (gb.registerE >> 1);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerE == 0);
    }
    //RR H
    //#0x1C:
    , function (gb: GameBoyCore) {
        var newFCarry = ((gb.registersHL & 0x0100) == 0x0100);
        gb.registersHL = ((gb.FCarry) ? 0x8000 : 0) | ((gb.registersHL >> 1) & 0xFF00) | (gb.registersHL & 0xFF);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registersHL < 0x100);
    }
    //RR L
    //#0x1D:
    , function (gb: GameBoyCore) {
        var newFCarry = ((gb.registersHL & 0x01) == 0x01);
        gb.registersHL = (gb.registersHL & 0xFF00) | ((gb.FCarry) ? 0x80 : 0) | ((gb.registersHL & 0xFF) >> 1);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0xFF) == 0);
    }
    //RR (HL)
    //#0x1E:
    , function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        var newFCarry = ((temp_var & 0x01) == 0x01);
        temp_var = ((gb.FCarry) ? 0x80 : 0) | (temp_var >> 1);
        gb.FCarry = newFCarry;
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (temp_var == 0);
    }
    //RR A
    //#0x1F:
    , function (gb: GameBoyCore) {
        var newFCarry = ((gb.registerA & 0x01) == 0x01);
        gb.registerA = ((gb.FCarry) ? 0x80 : 0) | (gb.registerA >> 1);
        gb.FCarry = newFCarry;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerA == 0);
    }
    //SLA B
    //#0x20:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerB > 0x7F);
        gb.registerB = (gb.registerB << 1) & 0xFF;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerB == 0);
    }
    //SLA C
    //#0x21:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerC > 0x7F);
        gb.registerC = (gb.registerC << 1) & 0xFF;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerC == 0);
    }
    //SLA D
    //#0x22:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerD > 0x7F);
        gb.registerD = (gb.registerD << 1) & 0xFF;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerD == 0);
    }
    //SLA E
    //#0x23:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerE > 0x7F);
        gb.registerE = (gb.registerE << 1) & 0xFF;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerE == 0);
    }
    //SLA H
    //#0x24:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registersHL > 0x7FFF);
        gb.registersHL = ((gb.registersHL << 1) & 0xFE00) | (gb.registersHL & 0xFF);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registersHL < 0x100);
    }
    //SLA L
    //#0x25:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registersHL & 0x0080) == 0x0080);
        gb.registersHL = (gb.registersHL & 0xFF00) | ((gb.registersHL << 1) & 0xFF);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0xFF) == 0);
    }
    //SLA (HL)
    //#0x26:
    , function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FCarry = (temp_var > 0x7F);
        temp_var = (temp_var << 1) & 0xFF;
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (temp_var == 0);
    }
    //SLA A
    //#0x27:
    , function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerA > 0x7F);
        gb.registerA = (gb.registerA << 1) & 0xFF;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerA == 0);
    }
    //SRA B
    //#0x28:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerB & 0x01) == 0x01);
        gb.registerB = (gb.registerB & 0x80) | (gb.registerB >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerB == 0);
    }
    //SRA C
    //#0x29:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerC & 0x01) == 0x01);
        gb.registerC = (gb.registerC & 0x80) | (gb.registerC >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerC == 0);
    }
    //SRA D
    //#0x2A:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerD & 0x01) == 0x01);
        gb.registerD = (gb.registerD & 0x80) | (gb.registerD >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerD == 0);
    }
    //SRA E
    //#0x2B:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerE & 0x01) == 0x01);
        gb.registerE = (gb.registerE & 0x80) | (gb.registerE >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerE == 0);
    }
    //SRA H
    //#0x2C:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registersHL & 0x0100) == 0x0100);
        gb.registersHL = ((gb.registersHL >> 1) & 0xFF00) | (gb.registersHL & 0x80FF);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registersHL < 0x100);
    }
    //SRA L
    //#0x2D:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registersHL & 0x0001) == 0x0001);
        gb.registersHL = (gb.registersHL & 0xFF80) | ((gb.registersHL & 0xFF) >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0xFF) == 0);
    }
    //SRA (HL)
    //#0x2E:
    , function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FCarry = ((temp_var & 0x01) == 0x01);
        temp_var = (temp_var & 0x80) | (temp_var >> 1);
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (temp_var == 0);
    }
    //SRA A
    //#0x2F:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerA & 0x01) == 0x01);
        gb.registerA = (gb.registerA & 0x80) | (gb.registerA >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerA == 0);
    }
    //SWAP B
    //#0x30:
    , function (gb: GameBoyCore) {
        gb.registerB = ((gb.registerB & 0xF) << 4) | (gb.registerB >> 4);
        gb.FZero = (gb.registerB == 0);
        gb.FCarry = gb.FHalfCarry = gb.FSubtract = false;
    }
    //SWAP C
    //#0x31:
    , function (gb: GameBoyCore) {
        gb.registerC = ((gb.registerC & 0xF) << 4) | (gb.registerC >> 4);
        gb.FZero = (gb.registerC == 0);
        gb.FCarry = gb.FHalfCarry = gb.FSubtract = false;
    }
    //SWAP D
    //#0x32:
    , function (gb: GameBoyCore) {
        gb.registerD = ((gb.registerD & 0xF) << 4) | (gb.registerD >> 4);
        gb.FZero = (gb.registerD == 0);
        gb.FCarry = gb.FHalfCarry = gb.FSubtract = false;
    }
    //SWAP E
    //#0x33:
    , function (gb: GameBoyCore) {
        gb.registerE = ((gb.registerE & 0xF) << 4) | (gb.registerE >> 4);
        gb.FZero = (gb.registerE == 0);
        gb.FCarry = gb.FHalfCarry = gb.FSubtract = false;
    }
    //SWAP H
    //#0x34:
    , function (gb: GameBoyCore) {
        gb.registersHL = ((gb.registersHL & 0xF00) << 4) | ((gb.registersHL & 0xF000) >> 4) | (gb.registersHL & 0xFF);
        gb.FZero = (gb.registersHL < 0x100);
        gb.FCarry = gb.FHalfCarry = gb.FSubtract = false;
    }
    //SWAP L
    //#0x35:
    , function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF00) | ((gb.registersHL & 0xF) << 4) | ((gb.registersHL & 0xF0) >> 4);
        gb.FZero = ((gb.registersHL & 0xFF) == 0);
        gb.FCarry = gb.FHalfCarry = gb.FSubtract = false;
    }
    //SWAP (HL)
    //#0x36:
    , function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        temp_var = ((temp_var & 0xF) << 4) | (temp_var >> 4);
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var);
        gb.FZero = (temp_var == 0);
        gb.FCarry = gb.FHalfCarry = gb.FSubtract = false;
    }
    //SWAP A
    //#0x37:
    , function (gb: GameBoyCore) {
        gb.registerA = ((gb.registerA & 0xF) << 4) | (gb.registerA >> 4);
        gb.FZero = (gb.registerA == 0);
        gb.FCarry = gb.FHalfCarry = gb.FSubtract = false;
    }
    //SRL B
    //#0x38:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerB & 0x01) == 0x01);
        gb.registerB >>= 1;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerB == 0);
    }
    //SRL C
    //#0x39:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerC & 0x01) == 0x01);
        gb.registerC >>= 1;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerC == 0);
    }
    //SRL D
    //#0x3A:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerD & 0x01) == 0x01);
        gb.registerD >>= 1;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerD == 0);
    }
    //SRL E
    //#0x3B:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerE & 0x01) == 0x01);
        gb.registerE >>= 1;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerE == 0);
    }
    //SRL H
    //#0x3C:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registersHL & 0x0100) == 0x0100);
        gb.registersHL = ((gb.registersHL >> 1) & 0xFF00) | (gb.registersHL & 0xFF);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registersHL < 0x100);
    }
    //SRL L
    //#0x3D:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registersHL & 0x0001) == 0x0001);
        gb.registersHL = (gb.registersHL & 0xFF00) | ((gb.registersHL & 0xFF) >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0xFF) == 0);
    }
    //SRL (HL)
    //#0x3E:
    , function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FCarry = ((temp_var & 0x01) == 0x01);
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var >> 1);
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (temp_var < 2);
    }
    //SRL A
    //#0x3F:
    , function (gb: GameBoyCore) {
        gb.FCarry = ((gb.registerA & 0x01) == 0x01);
        gb.registerA >>= 1;
        gb.FHalfCarry = gb.FSubtract = false;
        gb.FZero = (gb.registerA == 0);
    }
    //BIT 0, B
    //#0x40:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerB & 0x01) == 0);
    }
    //BIT 0, C
    //#0x41:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerC & 0x01) == 0);
    }
    //BIT 0, D
    //#0x42:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerD & 0x01) == 0);
    }
    //BIT 0, E
    //#0x43:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerE & 0x01) == 0);
    }
    //BIT 0, H
    //#0x44:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0100) == 0);
    }
    //BIT 0, L
    //#0x45:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0001) == 0);
    }
    //BIT 0, (HL)
    //#0x46:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0x01) == 0);
    }
    //BIT 0, A
    //#0x47:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerA & 0x01) == 0);
    }
    //BIT 1, B
    //#0x48:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerB & 0x02) == 0);
    }
    //BIT 1, C
    //#0x49:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerC & 0x02) == 0);
    }
    //BIT 1, D
    //#0x4A:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerD & 0x02) == 0);
    }
    //BIT 1, E
    //#0x4B:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerE & 0x02) == 0);
    }
    //BIT 1, H
    //#0x4C:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0200) == 0);
    }
    //BIT 1, L
    //#0x4D:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0002) == 0);
    }
    //BIT 1, (HL)
    //#0x4E:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0x02) == 0);
    }
    //BIT 1, A
    //#0x4F:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerA & 0x02) == 0);
    }
    //BIT 2, B
    //#0x50:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerB & 0x04) == 0);
    }
    //BIT 2, C
    //#0x51:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerC & 0x04) == 0);
    }
    //BIT 2, D
    //#0x52:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerD & 0x04) == 0);
    }
    //BIT 2, E
    //#0x53:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerE & 0x04) == 0);
    }
    //BIT 2, H
    //#0x54:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0400) == 0);
    }
    //BIT 2, L
    //#0x55:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0004) == 0);
    }
    //BIT 2, (HL)
    //#0x56:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0x04) == 0);
    }
    //BIT 2, A
    //#0x57:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerA & 0x04) == 0);
    }
    //BIT 3, B
    //#0x58:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerB & 0x08) == 0);
    }
    //BIT 3, C
    //#0x59:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerC & 0x08) == 0);
    }
    //BIT 3, D
    //#0x5A:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerD & 0x08) == 0);
    }
    //BIT 3, E
    //#0x5B:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerE & 0x08) == 0);
    }
    //BIT 3, H
    //#0x5C:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0800) == 0);
    }
    //BIT 3, L
    //#0x5D:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0008) == 0);
    }
    //BIT 3, (HL)
    //#0x5E:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0x08) == 0);
    }
    //BIT 3, A
    //#0x5F:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerA & 0x08) == 0);
    }
    //BIT 4, B
    //#0x60:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerB & 0x10) == 0);
    }
    //BIT 4, C
    //#0x61:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerC & 0x10) == 0);
    }
    //BIT 4, D
    //#0x62:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerD & 0x10) == 0);
    }
    //BIT 4, E
    //#0x63:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerE & 0x10) == 0);
    }
    //BIT 4, H
    //#0x64:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x1000) == 0);
    }
    //BIT 4, L
    //#0x65:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0010) == 0);
    }
    //BIT 4, (HL)
    //#0x66:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0x10) == 0);
    }
    //BIT 4, A
    //#0x67:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerA & 0x10) == 0);
    }
    //BIT 5, B
    //#0x68:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerB & 0x20) == 0);
    }
    //BIT 5, C
    //#0x69:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerC & 0x20) == 0);
    }
    //BIT 5, D
    //#0x6A:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerD & 0x20) == 0);
    }
    //BIT 5, E
    //#0x6B:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerE & 0x20) == 0);
    }
    //BIT 5, H
    //#0x6C:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x2000) == 0);
    }
    //BIT 5, L
    //#0x6D:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0020) == 0);
    }
    //BIT 5, (HL)
    //#0x6E:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0x20) == 0);
    }
    //BIT 5, A
    //#0x6F:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerA & 0x20) == 0);
    }
    //BIT 6, B
    //#0x70:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerB & 0x40) == 0);
    }
    //BIT 6, C
    //#0x71:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerC & 0x40) == 0);
    }
    //BIT 6, D
    //#0x72:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerD & 0x40) == 0);
    }
    //BIT 6, E
    //#0x73:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerE & 0x40) == 0);
    }
    //BIT 6, H
    //#0x74:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x4000) == 0);
    }
    //BIT 6, L
    //#0x75:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0040) == 0);
    }
    //BIT 6, (HL)
    //#0x76:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0x40) == 0);
    }
    //BIT 6, A
    //#0x77:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerA & 0x40) == 0);
    }
    //BIT 7, B
    //#0x78:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerB & 0x80) == 0);
    }
    //BIT 7, C
    //#0x79:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerC & 0x80) == 0);
    }
    //BIT 7, D
    //#0x7A:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerD & 0x80) == 0);
    }
    //BIT 7, E
    //#0x7B:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerE & 0x80) == 0);
    }
    //BIT 7, H
    //#0x7C:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x8000) == 0);
    }
    //BIT 7, L
    //#0x7D:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registersHL & 0x0080) == 0);
    }
    //BIT 7, (HL)
    //#0x7E:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0x80) == 0);
    }
    //BIT 7, A
    //#0x7F:
    , function (gb: GameBoyCore) {
        gb.FHalfCarry = true;
        gb.FSubtract = false;
        gb.FZero = ((gb.registerA & 0x80) == 0);
    }
    //RES 0, B
    //#0x80:
    , function (gb: GameBoyCore) {
        gb.registerB &= 0xFE;
    }
    //RES 0, C
    //#0x81:
    , function (gb: GameBoyCore) {
        gb.registerC &= 0xFE;
    }
    //RES 0, D
    //#0x82:
    , function (gb: GameBoyCore) {
        gb.registerD &= 0xFE;
    }
    //RES 0, E
    //#0x83:
    , function (gb: GameBoyCore) {
        gb.registerE &= 0xFE;
    }
    //RES 0, H
    //#0x84:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFEFF;
    }
    //RES 0, L
    //#0x85:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFFFE;
    }
    //RES 0, (HL)
    //#0x86:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0xFE);
    }
    //RES 0, A
    //#0x87:
    , function (gb: GameBoyCore) {
        gb.registerA &= 0xFE;
    }
    //RES 1, B
    //#0x88:
    , function (gb: GameBoyCore) {
        gb.registerB &= 0xFD;
    }
    //RES 1, C
    //#0x89:
    , function (gb: GameBoyCore) {
        gb.registerC &= 0xFD;
    }
    //RES 1, D
    //#0x8A:
    , function (gb: GameBoyCore) {
        gb.registerD &= 0xFD;
    }
    //RES 1, E
    //#0x8B:
    , function (gb: GameBoyCore) {
        gb.registerE &= 0xFD;
    }
    //RES 1, H
    //#0x8C:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFDFF;
    }
    //RES 1, L
    //#0x8D:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFFFD;
    }
    //RES 1, (HL)
    //#0x8E:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0xFD);
    }
    //RES 1, A
    //#0x8F:
    , function (gb: GameBoyCore) {
        gb.registerA &= 0xFD;
    }
    //RES 2, B
    //#0x90:
    , function (gb: GameBoyCore) {
        gb.registerB &= 0xFB;
    }
    //RES 2, C
    //#0x91:
    , function (gb: GameBoyCore) {
        gb.registerC &= 0xFB;
    }
    //RES 2, D
    //#0x92:
    , function (gb: GameBoyCore) {
        gb.registerD &= 0xFB;
    }
    //RES 2, E
    //#0x93:
    , function (gb: GameBoyCore) {
        gb.registerE &= 0xFB;
    }
    //RES 2, H
    //#0x94:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFBFF;
    }
    //RES 2, L
    //#0x95:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFFFB;
    }
    //RES 2, (HL)
    //#0x96:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0xFB);
    }
    //RES 2, A
    //#0x97:
    , function (gb: GameBoyCore) {
        gb.registerA &= 0xFB;
    }
    //RES 3, B
    //#0x98:
    , function (gb: GameBoyCore) {
        gb.registerB &= 0xF7;
    }
    //RES 3, C
    //#0x99:
    , function (gb: GameBoyCore) {
        gb.registerC &= 0xF7;
    }
    //RES 3, D
    //#0x9A:
    , function (gb: GameBoyCore) {
        gb.registerD &= 0xF7;
    }
    //RES 3, E
    //#0x9B:
    , function (gb: GameBoyCore) {
        gb.registerE &= 0xF7;
    }
    //RES 3, H
    //#0x9C:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xF7FF;
    }
    //RES 3, L
    //#0x9D:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFFF7;
    }
    //RES 3, (HL)
    //#0x9E:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0xF7);
    }
    //RES 3, A
    //#0x9F:
    , function (gb: GameBoyCore) {
        gb.registerA &= 0xF7;
    }
    //RES 3, B
    //#0xA0:
    , function (gb: GameBoyCore) {
        gb.registerB &= 0xEF;
    }
    //RES 4, C
    //#0xA1:
    , function (gb: GameBoyCore) {
        gb.registerC &= 0xEF;
    }
    //RES 4, D
    //#0xA2:
    , function (gb: GameBoyCore) {
        gb.registerD &= 0xEF;
    }
    //RES 4, E
    //#0xA3:
    , function (gb: GameBoyCore) {
        gb.registerE &= 0xEF;
    }
    //RES 4, H
    //#0xA4:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xEFFF;
    }
    //RES 4, L
    //#0xA5:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFFEF;
    }
    //RES 4, (HL)
    //#0xA6:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0xEF);
    }
    //RES 4, A
    //#0xA7:
    , function (gb: GameBoyCore) {
        gb.registerA &= 0xEF;
    }
    //RES 5, B
    //#0xA8:
    , function (gb: GameBoyCore) {
        gb.registerB &= 0xDF;
    }
    //RES 5, C
    //#0xA9:
    , function (gb: GameBoyCore) {
        gb.registerC &= 0xDF;
    }
    //RES 5, D
    //#0xAA:
    , function (gb: GameBoyCore) {
        gb.registerD &= 0xDF;
    }
    //RES 5, E
    //#0xAB:
    , function (gb: GameBoyCore) {
        gb.registerE &= 0xDF;
    }
    //RES 5, H
    //#0xAC:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xDFFF;
    }
    //RES 5, L
    //#0xAD:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFFDF;
    }
    //RES 5, (HL)
    //#0xAE:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0xDF);
    }
    //RES 5, A
    //#0xAF:
    , function (gb: GameBoyCore) {
        gb.registerA &= 0xDF;
    }
    //RES 6, B
    //#0xB0:
    , function (gb: GameBoyCore) {
        gb.registerB &= 0xBF;
    }
    //RES 6, C
    //#0xB1:
    , function (gb: GameBoyCore) {
        gb.registerC &= 0xBF;
    }
    //RES 6, D
    //#0xB2:
    , function (gb: GameBoyCore) {
        gb.registerD &= 0xBF;
    }
    //RES 6, E
    //#0xB3:
    , function (gb: GameBoyCore) {
        gb.registerE &= 0xBF;
    }
    //RES 6, H
    //#0xB4:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xBFFF;
    }
    //RES 6, L
    //#0xB5:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFFBF;
    }
    //RES 6, (HL)
    //#0xB6:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0xBF);
    }
    //RES 6, A
    //#0xB7:
    , function (gb: GameBoyCore) {
        gb.registerA &= 0xBF;
    }
    //RES 7, B
    //#0xB8:
    , function (gb: GameBoyCore) {
        gb.registerB &= 0x7F;
    }
    //RES 7, C
    //#0xB9:
    , function (gb: GameBoyCore) {
        gb.registerC &= 0x7F;
    }
    //RES 7, D
    //#0xBA:
    , function (gb: GameBoyCore) {
        gb.registerD &= 0x7F;
    }
    //RES 7, E
    //#0xBB:
    , function (gb: GameBoyCore) {
        gb.registerE &= 0x7F;
    }
    //RES 7, H
    //#0xBC:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0x7FFF;
    }
    //RES 7, L
    //#0xBD:
    , function (gb: GameBoyCore) {
        gb.registersHL &= 0xFF7F;
    }
    //RES 7, (HL)
    //#0xBE:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) & 0x7F);
    }
    //RES 7, A
    //#0xBF:
    , function (gb: GameBoyCore) {
        gb.registerA &= 0x7F;
    }
    //SET 0, B
    //#0xC0:
    , function (gb: GameBoyCore) {
        gb.registerB |= 0x01;
    }
    //SET 0, C
    //#0xC1:
    , function (gb: GameBoyCore) {
        gb.registerC |= 0x01;
    }
    //SET 0, D
    //#0xC2:
    , function (gb: GameBoyCore) {
        gb.registerD |= 0x01;
    }
    //SET 0, E
    //#0xC3:
    , function (gb: GameBoyCore) {
        gb.registerE |= 0x01;
    }
    //SET 0, H
    //#0xC4:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x0100;
    }
    //SET 0, L
    //#0xC5:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x01;
    }
    //SET 0, (HL)
    //#0xC6:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) | 0x01);
    }
    //SET 0, A
    //#0xC7:
    , function (gb: GameBoyCore) {
        gb.registerA |= 0x01;
    }
    //SET 1, B
    //#0xC8:
    , function (gb: GameBoyCore) {
        gb.registerB |= 0x02;
    }
    //SET 1, C
    //#0xC9:
    , function (gb: GameBoyCore) {
        gb.registerC |= 0x02;
    }
    //SET 1, D
    //#0xCA:
    , function (gb: GameBoyCore) {
        gb.registerD |= 0x02;
    }
    //SET 1, E
    //#0xCB:
    , function (gb: GameBoyCore) {
        gb.registerE |= 0x02;
    }
    //SET 1, H
    //#0xCC:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x0200;
    }
    //SET 1, L
    //#0xCD:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x02;
    }
    //SET 1, (HL)
    //#0xCE:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) | 0x02);
    }
    //SET 1, A
    //#0xCF:
    , function (gb: GameBoyCore) {
        gb.registerA |= 0x02;
    }
    //SET 2, B
    //#0xD0:
    , function (gb: GameBoyCore) {
        gb.registerB |= 0x04;
    }
    //SET 2, C
    //#0xD1:
    , function (gb: GameBoyCore) {
        gb.registerC |= 0x04;
    }
    //SET 2, D
    //#0xD2:
    , function (gb: GameBoyCore) {
        gb.registerD |= 0x04;
    }
    //SET 2, E
    //#0xD3:
    , function (gb: GameBoyCore) {
        gb.registerE |= 0x04;
    }
    //SET 2, H
    //#0xD4:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x0400;
    }
    //SET 2, L
    //#0xD5:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x04;
    }
    //SET 2, (HL)
    //#0xD6:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) | 0x04);
    }
    //SET 2, A
    //#0xD7:
    , function (gb: GameBoyCore) {
        gb.registerA |= 0x04;
    }
    //SET 3, B
    //#0xD8:
    , function (gb: GameBoyCore) {
        gb.registerB |= 0x08;
    }
    //SET 3, C
    //#0xD9:
    , function (gb: GameBoyCore) {
        gb.registerC |= 0x08;
    }
    //SET 3, D
    //#0xDA:
    , function (gb: GameBoyCore) {
        gb.registerD |= 0x08;
    }
    //SET 3, E
    //#0xDB:
    , function (gb: GameBoyCore) {
        gb.registerE |= 0x08;
    }
    //SET 3, H
    //#0xDC:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x0800;
    }
    //SET 3, L
    //#0xDD:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x08;
    }
    //SET 3, (HL)
    //#0xDE:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) | 0x08);
    }
    //SET 3, A
    //#0xDF:
    , function (gb: GameBoyCore) {
        gb.registerA |= 0x08;
    }
    //SET 4, B
    //#0xE0:
    , function (gb: GameBoyCore) {
        gb.registerB |= 0x10;
    }
    //SET 4, C
    //#0xE1:
    , function (gb: GameBoyCore) {
        gb.registerC |= 0x10;
    }
    //SET 4, D
    //#0xE2:
    , function (gb: GameBoyCore) {
        gb.registerD |= 0x10;
    }
    //SET 4, E
    //#0xE3:
    , function (gb: GameBoyCore) {
        gb.registerE |= 0x10;
    }
    //SET 4, H
    //#0xE4:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x1000;
    }
    //SET 4, L
    //#0xE5:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x10;
    }
    //SET 4, (HL)
    //#0xE6:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) | 0x10);
    }
    //SET 4, A
    //#0xE7:
    , function (gb: GameBoyCore) {
        gb.registerA |= 0x10;
    }
    //SET 5, B
    //#0xE8:
    , function (gb: GameBoyCore) {
        gb.registerB |= 0x20;
    }
    //SET 5, C
    //#0xE9:
    , function (gb: GameBoyCore) {
        gb.registerC |= 0x20;
    }
    //SET 5, D
    //#0xEA:
    , function (gb: GameBoyCore) {
        gb.registerD |= 0x20;
    }
    //SET 5, E
    //#0xEB:
    , function (gb: GameBoyCore) {
        gb.registerE |= 0x20;
    }
    //SET 5, H
    //#0xEC:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x2000;
    }
    //SET 5, L
    //#0xED:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x20;
    }
    //SET 5, (HL)
    //#0xEE:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) | 0x20);
    }
    //SET 5, A
    //#0xEF:
    , function (gb: GameBoyCore) {
        gb.registerA |= 0x20;
    }
    //SET 6, B
    //#0xF0:
    , function (gb: GameBoyCore) {
        gb.registerB |= 0x40;
    }
    //SET 6, C
    //#0xF1:
    , function (gb: GameBoyCore) {
        gb.registerC |= 0x40;
    }
    //SET 6, D
    //#0xF2:
    , function (gb: GameBoyCore) {
        gb.registerD |= 0x40;
    }
    //SET 6, E
    //#0xF3:
    , function (gb: GameBoyCore) {
        gb.registerE |= 0x40;
    }
    //SET 6, H
    //#0xF4:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x4000;
    }
    //SET 6, L
    //#0xF5:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x40;
    }
    //SET 6, (HL)
    //#0xF6:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) | 0x40);
    }
    //SET 6, A
    //#0xF7:
    , function (gb: GameBoyCore) {
        gb.registerA |= 0x40;
    }
    //SET 7, B
    //#0xF8:
    , function (gb: GameBoyCore) {
        gb.registerB |= 0x80;
    }
    //SET 7, C
    //#0xF9:
    , function (gb: GameBoyCore) {
        gb.registerC |= 0x80;
    }
    //SET 7, D
    //#0xFA:
    , function (gb: GameBoyCore) {
        gb.registerD |= 0x80;
    }
    //SET 7, E
    //#0xFB:
    , function (gb: GameBoyCore) {
        gb.registerE |= 0x80;
    }
    //SET 7, H
    //#0xFC:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x8000;
    }
    //SET 7, L
    //#0xFD:
    , function (gb: GameBoyCore) {
        gb.registersHL |= 0x80;
    }
    //SET 7, (HL)
    //#0xFE:
    , function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.registersHL](gb, gb.registersHL) | 0x80);
    }
    //SET 7, A
    //#0xFF:
    , function (gb: GameBoyCore) {
        gb.registerA |= 0x80;
    }
];