const OPCODE = [
    //NOP
    //#0x00:
    function (gb: GameBoyCore) {
        //Do Nothing...
    },
    //LD BC, nn
    //#0x01:
    function (gb: GameBoyCore) {
        gb.registerC = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.registerB = gb.memoryRead((gb.programCounter + 1) & 0xFFFF);
        gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
    },
    //LD (BC), A
    //#0x02:
    function (gb: GameBoyCore) {
        gb.memoryWrite((gb.registerB << 8) | gb.registerC, gb.registerA);
    },
    //INC BC
    //#0x03:
    function (gb: GameBoyCore) {
        var temp_var = ((gb.registerB << 8) | gb.registerC) + 1;
        gb.registerB = (temp_var >> 8) & 0xFF;
        gb.registerC = temp_var & 0xFF;
    },
    //INC B
    //#0x04:
    function (gb: GameBoyCore) {
        gb.registerB = (gb.registerB + 1) & 0xFF;
        gb.FZero = (gb.registerB == 0);
        gb.FHalfCarry = ((gb.registerB & 0xF) == 0);
        gb.FSubtract = false;
    },
    //DEC B
    //#0x05:
    function (gb: GameBoyCore) {
        gb.registerB = (gb.registerB - 1) & 0xFF;
        gb.FZero = (gb.registerB == 0);
        gb.FHalfCarry = ((gb.registerB & 0xF) == 0xF);
        gb.FSubtract = true;
    },
    //LD B, n
    //#0x06:
    function (gb: GameBoyCore) {
        gb.registerB = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //RLCA
    //#0x07:
    function (gb: GameBoyCore) {
        gb.FCarry = (gb.registerA > 0x7F);
        gb.registerA = ((gb.registerA << 1) & 0xFF) | (gb.registerA >> 7);
        gb.FZero = gb.FSubtract = gb.FHalfCarry = false;
    },
    //LD (nn), SP
    //#0x08:
    function (gb: GameBoyCore) {
        var temp_var = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        gb.memoryWrite(temp_var, gb.stackPointer & 0xFF);
        gb.memoryWrite((temp_var + 1) & 0xFFFF, gb.stackPointer >> 8);
    },
    //ADD HL, BC
    //#0x09:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registersHL + ((gb.registerB << 8) | gb.registerC);
        gb.FHalfCarry = ((gb.registersHL & 0xFFF) > (dirtySum & 0xFFF));
        gb.FCarry = (dirtySum > 0xFFFF);
        gb.registersHL = dirtySum & 0xFFFF;
        gb.FSubtract = false;
    },
    //LD A, (BC)
    //#0x0A:
    function (gb: GameBoyCore) {
        gb.registerA = gb.memoryRead((gb.registerB << 8) | gb.registerC);
    },
    //DEC BC
    //#0x0B:
    function (gb: GameBoyCore) {
        var temp_var = (((gb.registerB << 8) | gb.registerC) - 1) & 0xFFFF;
        gb.registerB = temp_var >> 8;
        gb.registerC = temp_var & 0xFF;
    },
    //INC C
    //#0x0C:
    function (gb: GameBoyCore) {
        gb.registerC = (gb.registerC + 1) & 0xFF;
        gb.FZero = (gb.registerC == 0);
        gb.FHalfCarry = ((gb.registerC & 0xF) == 0);
        gb.FSubtract = false;
    },
    //DEC C
    //#0x0D:
    function (gb: GameBoyCore) {
        gb.registerC = (gb.registerC - 1) & 0xFF;
        gb.FZero = (gb.registerC == 0);
        gb.FHalfCarry = ((gb.registerC & 0xF) == 0xF);
        gb.FSubtract = true;
    },
    //LD C, n
    //#0x0E:
    function (gb: GameBoyCore) {
        gb.registerC = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //RRCA
    //#0x0F:
    function (gb: GameBoyCore) {
        gb.registerA = (gb.registerA >> 1) | ((gb.registerA & 1) << 7);
        gb.FCarry = (gb.registerA > 0x7F);
        gb.FZero = gb.FSubtract = gb.FHalfCarry = false;
    },
    //STOP
    //#0x10:
    function (gb: GameBoyCore) {
        if (gb.cGBC) {
            if ((gb.memory[0xFF4D] & 0x01) == 0x01) {		//Speed change requested.
                if (gb.memory[0xFF4D] > 0x7F) {				//Go back to single speed mode.
                    cout("Going into single clock speed mode.", 0);
                    gb.doubleSpeedShifter = 0;
                    gb.memory[0xFF4D] &= 0x7F;				//Clear the double speed mode flag.
                }
                else {												//Go to double speed mode.
                    cout("Going into double clock speed mode.", 0);
                    gb.doubleSpeedShifter = 1;
                    gb.memory[0xFF4D] |= 0x80;				//Set the double speed mode flag.
                }
                gb.memory[0xFF4D] &= 0xFE;					//Reset the request bit.
            }
            else {
                gb.handleSTOP();
            }
        }
        else {
            gb.handleSTOP();
        }
    },
    //LD DE, nn
    //#0x11:
    function (gb: GameBoyCore) {
        gb.registerE = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.registerD = gb.memoryRead((gb.programCounter + 1) & 0xFFFF);
        gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
    },
    //LD (DE), A
    //#0x12:
    function (gb: GameBoyCore) {
        gb.memoryWrite((gb.registerD << 8) | gb.registerE, gb.registerA);
    },
    //INC DE
    //#0x13:
    function (gb: GameBoyCore) {
        var temp_var = ((gb.registerD << 8) | gb.registerE) + 1;
        gb.registerD = (temp_var >> 8) & 0xFF;
        gb.registerE = temp_var & 0xFF;
    },
    //INC D
    //#0x14:
    function (gb: GameBoyCore) {
        gb.registerD = (gb.registerD + 1) & 0xFF;
        gb.FZero = (gb.registerD == 0);
        gb.FHalfCarry = ((gb.registerD & 0xF) == 0);
        gb.FSubtract = false;
    },
    //DEC D
    //#0x15:
    function (gb: GameBoyCore) {
        gb.registerD = (gb.registerD - 1) & 0xFF;
        gb.FZero = (gb.registerD == 0);
        gb.FHalfCarry = ((gb.registerD & 0xF) == 0xF);
        gb.FSubtract = true;
    },
    //LD D, n
    //#0x16:
    function (gb: GameBoyCore) {
        gb.registerD = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //RLA
    //#0x17:
    function (gb: GameBoyCore) {
        var carry_flag = (gb.FCarry) ? 1 : 0;
        gb.FCarry = (gb.registerA > 0x7F);
        gb.registerA = ((gb.registerA << 1) & 0xFF) | carry_flag;
        gb.FZero = gb.FSubtract = gb.FHalfCarry = false;
    },
    //JR n
    //#0x18:
    function (gb: GameBoyCore) {
        gb.programCounter = (gb.programCounter + ((gb.memoryReader[gb.programCounter](gb, gb.programCounter) << 24) >> 24) + 1) & 0xFFFF;
    },
    //ADD HL, DE
    //#0x19:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registersHL + ((gb.registerD << 8) | gb.registerE);
        gb.FHalfCarry = ((gb.registersHL & 0xFFF) > (dirtySum & 0xFFF));
        gb.FCarry = (dirtySum > 0xFFFF);
        gb.registersHL = dirtySum & 0xFFFF;
        gb.FSubtract = false;
    },
    //LD A, (DE)
    //#0x1A:
    function (gb: GameBoyCore) {
        gb.registerA = gb.memoryRead((gb.registerD << 8) | gb.registerE);
    },
    //DEC DE
    //#0x1B:
    function (gb: GameBoyCore) {
        var temp_var = (((gb.registerD << 8) | gb.registerE) - 1) & 0xFFFF;
        gb.registerD = temp_var >> 8;
        gb.registerE = temp_var & 0xFF;
    },
    //INC E
    //#0x1C:
    function (gb: GameBoyCore) {
        gb.registerE = (gb.registerE + 1) & 0xFF;
        gb.FZero = (gb.registerE == 0);
        gb.FHalfCarry = ((gb.registerE & 0xF) == 0);
        gb.FSubtract = false;
    },
    //DEC E
    //#0x1D:
    function (gb: GameBoyCore) {
        gb.registerE = (gb.registerE - 1) & 0xFF;
        gb.FZero = (gb.registerE == 0);
        gb.FHalfCarry = ((gb.registerE & 0xF) == 0xF);
        gb.FSubtract = true;
    },
    //LD E, n
    //#0x1E:
    function (gb: GameBoyCore) {
        gb.registerE = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //RRA
    //#0x1F:
    function (gb: GameBoyCore) {
        var carry_flag = (gb.FCarry) ? 0x80 : 0;
        gb.FCarry = ((gb.registerA & 1) == 1);
        gb.registerA = (gb.registerA >> 1) | carry_flag;
        gb.FZero = gb.FSubtract = gb.FHalfCarry = false;
    },
    //JR NZ, n
    //#0x20:
    function (gb: GameBoyCore) {
        if (!gb.FZero) {
            gb.programCounter = (gb.programCounter + ((gb.memoryReader[gb.programCounter](gb, gb.programCounter) << 24) >> 24) + 1) & 0xFFFF;
            gb.CPUTicks += 4;
        }
        else {
            gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        }
    },
    //LD HL, nn
    //#0x21:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
    },
    //LDI (HL), A
    //#0x22:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.registerA);
        gb.registersHL = (gb.registersHL + 1) & 0xFFFF;
    },
    //INC HL
    //#0x23:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL + 1) & 0xFFFF;
    },
    //INC H
    //#0x24:
    function (gb: GameBoyCore) {
        var H = ((gb.registersHL >> 8) + 1) & 0xFF;
        gb.FZero = (H == 0);
        gb.FHalfCarry = ((H & 0xF) == 0);
        gb.FSubtract = false;
        gb.registersHL = (H << 8) | (gb.registersHL & 0xFF);
    },
    //DEC H
    //#0x25:
    function (gb: GameBoyCore) {
        var H = ((gb.registersHL >> 8) - 1) & 0xFF;
        gb.FZero = (H == 0);
        gb.FHalfCarry = ((H & 0xF) == 0xF);
        gb.FSubtract = true;
        gb.registersHL = (H << 8) | (gb.registersHL & 0xFF);
    },
    //LD H, n
    //#0x26:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.memoryReader[gb.programCounter](gb, gb.programCounter) << 8) | (gb.registersHL & 0xFF);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //DAA
    //#0x27:
    function (gb: GameBoyCore) {
        if (!gb.FSubtract) {
            if (gb.FCarry || gb.registerA > 0x99) {
                gb.registerA = (gb.registerA + 0x60) & 0xFF;
                gb.FCarry = true;
            }
            if (gb.FHalfCarry || (gb.registerA & 0xF) > 0x9) {
                gb.registerA = (gb.registerA + 0x06) & 0xFF;
                gb.FHalfCarry = false;
            }
        }
        else if (gb.FCarry && gb.FHalfCarry) {
            gb.registerA = (gb.registerA + 0x9A) & 0xFF;
            gb.FHalfCarry = false;
        }
        else if (gb.FCarry) {
            gb.registerA = (gb.registerA + 0xA0) & 0xFF;
        }
        else if (gb.FHalfCarry) {
            gb.registerA = (gb.registerA + 0xFA) & 0xFF;
            gb.FHalfCarry = false;
        }
        gb.FZero = (gb.registerA == 0);
    },
    //JR Z, n
    //#0x28:
    function (gb: GameBoyCore) {
        if (gb.FZero) {
            gb.programCounter = (gb.programCounter + ((gb.memoryReader[gb.programCounter](gb, gb.programCounter) << 24) >> 24) + 1) & 0xFFFF;
            gb.CPUTicks += 4;
        }
        else {
            gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        }
    },
    //ADD HL, HL
    //#0x29:
    function (gb: GameBoyCore) {
        gb.FHalfCarry = ((gb.registersHL & 0xFFF) > 0x7FF);
        gb.FCarry = (gb.registersHL > 0x7FFF);
        gb.registersHL = (gb.registersHL << 1) & 0xFFFF;
        gb.FSubtract = false;
    },
    //LDI A, (HL)
    //#0x2A:
    function (gb: GameBoyCore) {
        gb.registerA = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.registersHL = (gb.registersHL + 1) & 0xFFFF;
    },
    //DEC HL
    //#0x2B:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL - 1) & 0xFFFF;
    },
    //INC L
    //#0x2C:
    function (gb: GameBoyCore) {
        var L = (gb.registersHL + 1) & 0xFF;
        gb.FZero = (L == 0);
        gb.FHalfCarry = ((L & 0xF) == 0);
        gb.FSubtract = false;
        gb.registersHL = (gb.registersHL & 0xFF00) | L;
    },
    //DEC L
    //#0x2D:
    function (gb: GameBoyCore) {
        var L = (gb.registersHL - 1) & 0xFF;
        gb.FZero = (L == 0);
        gb.FHalfCarry = ((L & 0xF) == 0xF);
        gb.FSubtract = true;
        gb.registersHL = (gb.registersHL & 0xFF00) | L;
    },
    //LD L, n
    //#0x2E:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF00) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //CPL
    //#0x2F:
    function (gb: GameBoyCore) {
        gb.registerA ^= 0xFF;
        gb.FSubtract = gb.FHalfCarry = true;
    },
    //JR NC, n
    //#0x30:
    function (gb: GameBoyCore) {
        if (!gb.FCarry) {
            gb.programCounter = (gb.programCounter + ((gb.memoryReader[gb.programCounter](gb, gb.programCounter) << 24) >> 24) + 1) & 0xFFFF;
            gb.CPUTicks += 4;
        }
        else {
            gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        }
    },
    //LD SP, nn
    //#0x31:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
    },
    //LDD (HL), A
    //#0x32:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.registerA);
        gb.registersHL = (gb.registersHL - 1) & 0xFFFF;
    },
    //INC SP
    //#0x33:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer + 1) & 0xFFFF;
    },
    //INC (HL)
    //#0x34:
    function (gb: GameBoyCore) {
        var temp_var = (gb.memoryReader[gb.registersHL](gb, gb.registersHL) + 1) & 0xFF;
        gb.FZero = (temp_var == 0);
        gb.FHalfCarry = ((temp_var & 0xF) == 0);
        gb.FSubtract = false;
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var);
    },
    //DEC (HL)
    //#0x35:
    function (gb: GameBoyCore) {
        var temp_var = (gb.memoryReader[gb.registersHL](gb, gb.registersHL) - 1) & 0xFF;
        gb.FZero = (temp_var == 0);
        gb.FHalfCarry = ((temp_var & 0xF) == 0xF);
        gb.FSubtract = true;
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, temp_var);
    },
    //LD (HL), n
    //#0x36:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.memoryReader[gb.programCounter](gb, gb.programCounter));
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //SCF
    //#0x37:
    function (gb: GameBoyCore) {
        gb.FCarry = true;
        gb.FSubtract = gb.FHalfCarry = false;
    },
    //JR C, n
    //#0x38:
    function (gb: GameBoyCore) {
        if (gb.FCarry) {
            gb.programCounter = (gb.programCounter + ((gb.memoryReader[gb.programCounter](gb, gb.programCounter) << 24) >> 24) + 1) & 0xFFFF;
            gb.CPUTicks += 4;
        }
        else {
            gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        }
    },
    //ADD HL, SP
    //#0x39:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registersHL + gb.stackPointer;
        gb.FHalfCarry = ((gb.registersHL & 0xFFF) > (dirtySum & 0xFFF));
        gb.FCarry = (dirtySum > 0xFFFF);
        gb.registersHL = dirtySum & 0xFFFF;
        gb.FSubtract = false;
    },
    //LDD A, (HL)
    //#0x3A:
    function (gb: GameBoyCore) {
        gb.registerA = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.registersHL = (gb.registersHL - 1) & 0xFFFF;
    },
    //DEC SP
    //#0x3B:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
    },
    //INC A
    //#0x3C:
    function (gb: GameBoyCore) {
        gb.registerA = (gb.registerA + 1) & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) == 0);
        gb.FSubtract = false;
    },
    //DEC A
    //#0x3D:
    function (gb: GameBoyCore) {
        gb.registerA = (gb.registerA - 1) & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) == 0xF);
        gb.FSubtract = true;
    },
    //LD A, n
    //#0x3E:
    function (gb: GameBoyCore) {
        gb.registerA = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //CCF
    //#0x3F:
    function (gb: GameBoyCore) {
        gb.FCarry = !gb.FCarry;
        gb.FSubtract = gb.FHalfCarry = false;
    },
    //LD B, B
    //#0x40:
    function (gb: GameBoyCore) {
        //Do nothing...
    },
    //LD B, C
    //#0x41:
    function (gb: GameBoyCore) {
        gb.registerB = gb.registerC;
    },
    //LD B, D
    //#0x42:
    function (gb: GameBoyCore) {
        gb.registerB = gb.registerD;
    },
    //LD B, E
    //#0x43:
    function (gb: GameBoyCore) {
        gb.registerB = gb.registerE;
    },
    //LD B, H
    //#0x44:
    function (gb: GameBoyCore) {
        gb.registerB = gb.registersHL >> 8;
    },
    //LD B, L
    //#0x45:
    function (gb: GameBoyCore) {
        gb.registerB = gb.registersHL & 0xFF;
    },
    //LD B, (HL)
    //#0x46:
    function (gb: GameBoyCore) {
        gb.registerB = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
    },
    //LD B, A
    //#0x47:
    function (gb: GameBoyCore) {
        gb.registerB = gb.registerA;
    },
    //LD C, B
    //#0x48:
    function (gb: GameBoyCore) {
        gb.registerC = gb.registerB;
    },
    //LD C, C
    //#0x49:
    function (gb: GameBoyCore) {
        //Do nothing...
    },
    //LD C, D
    //#0x4A:
    function (gb: GameBoyCore) {
        gb.registerC = gb.registerD;
    },
    //LD C, E
    //#0x4B:
    function (gb: GameBoyCore) {
        gb.registerC = gb.registerE;
    },
    //LD C, H
    //#0x4C:
    function (gb: GameBoyCore) {
        gb.registerC = gb.registersHL >> 8;
    },
    //LD C, L
    //#0x4D:
    function (gb: GameBoyCore) {
        gb.registerC = gb.registersHL & 0xFF;
    },
    //LD C, (HL)
    //#0x4E:
    function (gb: GameBoyCore) {
        gb.registerC = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
    },
    //LD C, A
    //#0x4F:
    function (gb: GameBoyCore) {
        gb.registerC = gb.registerA;
    },
    //LD D, B
    //#0x50:
    function (gb: GameBoyCore) {
        gb.registerD = gb.registerB;
    },
    //LD D, C
    //#0x51:
    function (gb: GameBoyCore) {
        gb.registerD = gb.registerC;
    },
    //LD D, D
    //#0x52:
    function (gb: GameBoyCore) {
        //Do nothing...
    },
    //LD D, E
    //#0x53:
    function (gb: GameBoyCore) {
        gb.registerD = gb.registerE;
    },
    //LD D, H
    //#0x54:
    function (gb: GameBoyCore) {
        gb.registerD = gb.registersHL >> 8;
    },
    //LD D, L
    //#0x55:
    function (gb: GameBoyCore) {
        gb.registerD = gb.registersHL & 0xFF;
    },
    //LD D, (HL)
    //#0x56:
    function (gb: GameBoyCore) {
        gb.registerD = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
    },
    //LD D, A
    //#0x57:
    function (gb: GameBoyCore) {
        gb.registerD = gb.registerA;
    },
    //LD E, B
    //#0x58:
    function (gb: GameBoyCore) {
        gb.registerE = gb.registerB;
    },
    //LD E, C
    //#0x59:
    function (gb: GameBoyCore) {
        gb.registerE = gb.registerC;
    },
    //LD E, D
    //#0x5A:
    function (gb: GameBoyCore) {
        gb.registerE = gb.registerD;
    },
    //LD E, E
    //#0x5B:
    function (gb: GameBoyCore) {
        //Do nothing...
    },
    //LD E, H
    //#0x5C:
    function (gb: GameBoyCore) {
        gb.registerE = gb.registersHL >> 8;
    },
    //LD E, L
    //#0x5D:
    function (gb: GameBoyCore) {
        gb.registerE = gb.registersHL & 0xFF;
    },
    //LD E, (HL)
    //#0x5E:
    function (gb: GameBoyCore) {
        gb.registerE = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
    },
    //LD E, A
    //#0x5F:
    function (gb: GameBoyCore) {
        gb.registerE = gb.registerA;
    },
    //LD H, B
    //#0x60:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registerB << 8) | (gb.registersHL & 0xFF);
    },
    //LD H, C
    //#0x61:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registerC << 8) | (gb.registersHL & 0xFF);
    },
    //LD H, D
    //#0x62:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registerD << 8) | (gb.registersHL & 0xFF);
    },
    //LD H, E
    //#0x63:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registerE << 8) | (gb.registersHL & 0xFF);
    },
    //LD H, H
    //#0x64:
    function (gb: GameBoyCore) {
        //Do nothing...
    },
    //LD H, L
    //#0x65:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF) * 0x101;
    },
    //LD H, (HL)
    //#0x66:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.memoryReader[gb.registersHL](gb, gb.registersHL) << 8) | (gb.registersHL & 0xFF);
    },
    //LD H, A
    //#0x67:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registerA << 8) | (gb.registersHL & 0xFF);
    },
    //LD L, B
    //#0x68:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF00) | gb.registerB;
    },
    //LD L, C
    //#0x69:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF00) | gb.registerC;
    },
    //LD L, D
    //#0x6A:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF00) | gb.registerD;
    },
    //LD L, E
    //#0x6B:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF00) | gb.registerE;
    },
    //LD L, H
    //#0x6C:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF00) | (gb.registersHL >> 8);
    },
    //LD L, L
    //#0x6D:
    function (gb: GameBoyCore) {
        //Do nothing...
    },
    //LD L, (HL)
    //#0x6E:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF00) | gb.memoryReader[gb.registersHL](gb, gb.registersHL);
    },
    //LD L, A
    //#0x6F:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.registersHL & 0xFF00) | gb.registerA;
    },
    //LD (HL), B
    //#0x70:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.registerB);
    },
    //LD (HL), C
    //#0x71:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.registerC);
    },
    //LD (HL), D
    //#0x72:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.registerD);
    },
    //LD (HL), E
    //#0x73:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.registerE);
    },
    //LD (HL), H
    //#0x74:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.registersHL >> 8);
    },
    //LD (HL), L
    //#0x75:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.registersHL & 0xFF);
    },
    //HALT
    //#0x76:
    function (gb: GameBoyCore) {
        //See if there's already an IRQ match:
        if ((gb.interruptsEnabled & gb.interruptsRequested & 0x1F) > 0) {
            if (!gb.cGBC && !gb.usedBootROM) {
                //HALT bug in the DMG CPU model (Program Counter fails to increment for one instruction after HALT):
                gb.skipPCIncrement = true;
            }
            else {
                //CGB gets around the HALT PC bug by doubling the hidden NOP.
                gb.CPUTicks += 4;
            }
        }
        else {
            //CPU is stalled until the next IRQ match:
            gb.calculateHALTPeriod();
        }
    },
    //LD (HL), A
    //#0x77:
    function (gb: GameBoyCore) {
        gb.memoryWriter[gb.registersHL](gb, gb.registersHL, gb.registerA);
    },
    //LD A, B
    //#0x78:
    function (gb: GameBoyCore) {
        gb.registerA = gb.registerB;
    },
    //LD A, C
    //#0x79:
    function (gb: GameBoyCore) {
        gb.registerA = gb.registerC;
    },
    //LD A, D
    //#0x7A:
    function (gb: GameBoyCore) {
        gb.registerA = gb.registerD;
    },
    //LD A, E
    //#0x7B:
    function (gb: GameBoyCore) {
        gb.registerA = gb.registerE;
    },
    //LD A, H
    //#0x7C:
    function (gb: GameBoyCore) {
        gb.registerA = gb.registersHL >> 8;
    },
    //LD A, L
    //#0x7D:
    function (gb: GameBoyCore) {
        gb.registerA = gb.registersHL & 0xFF;
    },
    //LD, A, (HL)
    //#0x7E:
    function (gb: GameBoyCore) {
        gb.registerA = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
    },
    //LD A, A
    //#0x7F:
    function (gb: GameBoyCore) {
        //Do Nothing...
    },
    //ADD A, B
    //#0x80:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.registerB;
        gb.FHalfCarry = ((dirtySum & 0xF) < (gb.registerA & 0xF));
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADD A, C
    //#0x81:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.registerC;
        gb.FHalfCarry = ((dirtySum & 0xF) < (gb.registerA & 0xF));
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADD A, D
    //#0x82:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.registerD;
        gb.FHalfCarry = ((dirtySum & 0xF) < (gb.registerA & 0xF));
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADD A, E
    //#0x83:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.registerE;
        gb.FHalfCarry = ((dirtySum & 0xF) < (gb.registerA & 0xF));
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADD A, H
    //#0x84:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + (gb.registersHL >> 8);
        gb.FHalfCarry = ((dirtySum & 0xF) < (gb.registerA & 0xF));
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADD A, L
    //#0x85:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + (gb.registersHL & 0xFF);
        gb.FHalfCarry = ((dirtySum & 0xF) < (gb.registerA & 0xF));
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADD A, (HL)
    //#0x86:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FHalfCarry = ((dirtySum & 0xF) < (gb.registerA & 0xF));
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADD A, A
    //#0x87:
    function (gb: GameBoyCore) {
        gb.FHalfCarry = ((gb.registerA & 0x8) == 0x8);
        gb.FCarry = (gb.registerA > 0x7F);
        gb.registerA = (gb.registerA << 1) & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADC A, B
    //#0x88:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.registerB + ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) + (gb.registerB & 0xF) + ((gb.FCarry) ? 1 : 0) > 0xF);
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADC A, C
    //#0x89:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.registerC + ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) + (gb.registerC & 0xF) + ((gb.FCarry) ? 1 : 0) > 0xF);
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADC A, D
    //#0x8A:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.registerD + ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) + (gb.registerD & 0xF) + ((gb.FCarry) ? 1 : 0) > 0xF);
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADC A, E
    //#0x8B:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.registerE + ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) + (gb.registerE & 0xF) + ((gb.FCarry) ? 1 : 0) > 0xF);
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADC A, H
    //#0x8C:
    function (gb: GameBoyCore) {
        var tempValue = (gb.registersHL >> 8);
        var dirtySum = gb.registerA + tempValue + ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) + (tempValue & 0xF) + ((gb.FCarry) ? 1 : 0) > 0xF);
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADC A, L
    //#0x8D:
    function (gb: GameBoyCore) {
        var tempValue = (gb.registersHL & 0xFF);
        var dirtySum = gb.registerA + tempValue + ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) + (tempValue & 0xF) + ((gb.FCarry) ? 1 : 0) > 0xF);
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADC A, (HL)
    //#0x8E:
    function (gb: GameBoyCore) {
        var tempValue = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        var dirtySum = gb.registerA + tempValue + ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) + (tempValue & 0xF) + ((gb.FCarry) ? 1 : 0) > 0xF);
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //ADC A, A
    //#0x8F:
    function (gb: GameBoyCore) {
        //shift left register A one bit for some ops here as an optimization:
        var dirtySum = (gb.registerA << 1) | ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((((gb.registerA << 1) & 0x1E) | ((gb.FCarry) ? 1 : 0)) > 0xF);
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //SUB A, B
    //#0x90:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerB;
        gb.FHalfCarry = ((gb.registerA & 0xF) < (dirtySum & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //SUB A, C
    //#0x91:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerC;
        gb.FHalfCarry = ((gb.registerA & 0xF) < (dirtySum & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //SUB A, D
    //#0x92:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerD;
        gb.FHalfCarry = ((gb.registerA & 0xF) < (dirtySum & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //SUB A, E
    //#0x93:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerE;
        gb.FHalfCarry = ((gb.registerA & 0xF) < (dirtySum & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //SUB A, H
    //#0x94:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - (gb.registersHL >> 8);
        gb.FHalfCarry = ((gb.registerA & 0xF) < (dirtySum & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //SUB A, L
    //#0x95:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - (gb.registersHL & 0xFF);
        gb.FHalfCarry = ((gb.registerA & 0xF) < (dirtySum & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //SUB A, (HL)
    //#0x96:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FHalfCarry = ((gb.registerA & 0xF) < (dirtySum & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //SUB A, A
    //#0x97:
    function (gb: GameBoyCore) {
        //number - same number == 0
        gb.registerA = 0;
        gb.FHalfCarry = gb.FCarry = false;
        gb.FZero = gb.FSubtract = true;
    },
    //SBC A, B
    //#0x98:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerB - ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) - (gb.registerB & 0xF) - ((gb.FCarry) ? 1 : 0) < 0);
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = true;
    },
    //SBC A, C
    //#0x99:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerC - ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) - (gb.registerC & 0xF) - ((gb.FCarry) ? 1 : 0) < 0);
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = true;
    },
    //SBC A, D
    //#0x9A:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerD - ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) - (gb.registerD & 0xF) - ((gb.FCarry) ? 1 : 0) < 0);
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = true;
    },
    //SBC A, E
    //#0x9B:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerE - ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) - (gb.registerE & 0xF) - ((gb.FCarry) ? 1 : 0) < 0);
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = true;
    },
    //SBC A, H
    //#0x9C:
    function (gb: GameBoyCore) {
        var temp_var = gb.registersHL >> 8;
        var dirtySum = gb.registerA - temp_var - ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) - (temp_var & 0xF) - ((gb.FCarry) ? 1 : 0) < 0);
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = true;
    },
    //SBC A, L
    //#0x9D:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - (gb.registersHL & 0xFF) - ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) - (gb.registersHL & 0xF) - ((gb.FCarry) ? 1 : 0) < 0);
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = true;
    },
    //SBC A, (HL)
    //#0x9E:
    function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        var dirtySum = gb.registerA - temp_var - ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) - (temp_var & 0xF) - ((gb.FCarry) ? 1 : 0) < 0);
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = true;
    },
    //SBC A, A
    //#0x9F:
    function (gb: GameBoyCore) {
        //Optimized SBC A:
        if (gb.FCarry) {
            gb.FZero = false;
            gb.FSubtract = gb.FHalfCarry = gb.FCarry = true;
            gb.registerA = 0xFF;
        }
        else {
            gb.FHalfCarry = gb.FCarry = false;
            gb.FSubtract = gb.FZero = true;
            gb.registerA = 0;
        }
    },
    //AND B
    //#0xA0:
    function (gb: GameBoyCore) {
        gb.registerA &= gb.registerB;
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = true;
        gb.FSubtract = gb.FCarry = false;
    },
    //AND C
    //#0xA1:
    function (gb: GameBoyCore) {
        gb.registerA &= gb.registerC;
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = true;
        gb.FSubtract = gb.FCarry = false;
    },
    //AND D
    //#0xA2:
    function (gb: GameBoyCore) {
        gb.registerA &= gb.registerD;
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = true;
        gb.FSubtract = gb.FCarry = false;
    },
    //AND E
    //#0xA3:
    function (gb: GameBoyCore) {
        gb.registerA &= gb.registerE;
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = true;
        gb.FSubtract = gb.FCarry = false;
    },
    //AND H
    //#0xA4:
    function (gb: GameBoyCore) {
        gb.registerA &= (gb.registersHL >> 8);
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = true;
        gb.FSubtract = gb.FCarry = false;
    },
    //AND L
    //#0xA5:
    function (gb: GameBoyCore) {
        gb.registerA &= gb.registersHL;
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = true;
        gb.FSubtract = gb.FCarry = false;
    },
    //AND (HL)
    //#0xA6:
    function (gb: GameBoyCore) {
        gb.registerA &= gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = true;
        gb.FSubtract = gb.FCarry = false;
    },
    //AND A
    //#0xA7:
    function (gb: GameBoyCore) {
        //number & same number = same number
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = true;
        gb.FSubtract = gb.FCarry = false;
    },
    //XOR B
    //#0xA8:
    function (gb: GameBoyCore) {
        gb.registerA ^= gb.registerB;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FHalfCarry = gb.FCarry = false;
    },
    //XOR C
    //#0xA9:
    function (gb: GameBoyCore) {
        gb.registerA ^= gb.registerC;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FHalfCarry = gb.FCarry = false;
    },
    //XOR D
    //#0xAA:
    function (gb: GameBoyCore) {
        gb.registerA ^= gb.registerD;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FHalfCarry = gb.FCarry = false;
    },
    //XOR E
    //#0xAB:
    function (gb: GameBoyCore) {
        gb.registerA ^= gb.registerE;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FHalfCarry = gb.FCarry = false;
    },
    //XOR H
    //#0xAC:
    function (gb: GameBoyCore) {
        gb.registerA ^= (gb.registersHL >> 8);
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FHalfCarry = gb.FCarry = false;
    },
    //XOR L
    //#0xAD:
    function (gb: GameBoyCore) {
        gb.registerA ^= (gb.registersHL & 0xFF);
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FHalfCarry = gb.FCarry = false;
    },
    //XOR (HL)
    //#0xAE:
    function (gb: GameBoyCore) {
        gb.registerA ^= gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FHalfCarry = gb.FCarry = false;
    },
    //XOR A
    //#0xAF:
    function (gb: GameBoyCore) {
        //number ^ same number == 0
        gb.registerA = 0;
        gb.FZero = true;
        gb.FSubtract = gb.FHalfCarry = gb.FCarry = false;
    },
    //OR B
    //#0xB0:
    function (gb: GameBoyCore) {
        gb.registerA |= gb.registerB;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FCarry = gb.FHalfCarry = false;
    },
    //OR C
    //#0xB1:
    function (gb: GameBoyCore) {
        gb.registerA |= gb.registerC;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FCarry = gb.FHalfCarry = false;
    },
    //OR D
    //#0xB2:
    function (gb: GameBoyCore) {
        gb.registerA |= gb.registerD;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FCarry = gb.FHalfCarry = false;
    },
    //OR E
    //#0xB3:
    function (gb: GameBoyCore) {
        gb.registerA |= gb.registerE;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FCarry = gb.FHalfCarry = false;
    },
    //OR H
    //#0xB4:
    function (gb: GameBoyCore) {
        gb.registerA |= (gb.registersHL >> 8);
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FCarry = gb.FHalfCarry = false;
    },
    //OR L
    //#0xB5:
    function (gb: GameBoyCore) {
        gb.registerA |= (gb.registersHL & 0xFF);
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FCarry = gb.FHalfCarry = false;
    },
    //OR (HL)
    //#0xB6:
    function (gb: GameBoyCore) {
        gb.registerA |= gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FCarry = gb.FHalfCarry = false;
    },
    //OR A
    //#0xB7:
    function (gb: GameBoyCore) {
        //number | same number == same number
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FCarry = gb.FHalfCarry = false;
    },
    //CP B
    //#0xB8:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerB;
        gb.FHalfCarry = ((dirtySum & 0xF) > (gb.registerA & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //CP C
    //#0xB9:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerC;
        gb.FHalfCarry = ((dirtySum & 0xF) > (gb.registerA & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //CP D
    //#0xBA:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerD;
        gb.FHalfCarry = ((dirtySum & 0xF) > (gb.registerA & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //CP E
    //#0xBB:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.registerE;
        gb.FHalfCarry = ((dirtySum & 0xF) > (gb.registerA & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //CP H
    //#0xBC:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - (gb.registersHL >> 8);
        gb.FHalfCarry = ((dirtySum & 0xF) > (gb.registerA & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //CP L
    //#0xBD:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - (gb.registersHL & 0xFF);
        gb.FHalfCarry = ((dirtySum & 0xF) > (gb.registerA & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //CP (HL)
    //#0xBE:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.memoryReader[gb.registersHL](gb, gb.registersHL);
        gb.FHalfCarry = ((dirtySum & 0xF) > (gb.registerA & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //CP A
    //#0xBF:
    function (gb: GameBoyCore) {
        gb.FHalfCarry = gb.FCarry = false;
        gb.FZero = gb.FSubtract = true;
    },
    //RET !FZ
    //#0xC0:
    function (gb: GameBoyCore) {
        if (!gb.FZero) {
            gb.programCounter = (gb.memoryRead((gb.stackPointer + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
            gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
            gb.CPUTicks += 12;
        }
    },
    //POP BC
    //#0xC1:
    function (gb: GameBoyCore) {
        gb.registerC = gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
        gb.registerB = gb.memoryRead((gb.stackPointer + 1) & 0xFFFF);
        gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
    },
    //JP !FZ, nn
    //#0xC2:
    function (gb: GameBoyCore) {
        if (!gb.FZero) {
            gb.programCounter = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
            gb.CPUTicks += 4;
        }
        else {
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        }
    },
    //JP nn
    //#0xC3:
    function (gb: GameBoyCore) {
        gb.programCounter = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
    },
    //CALL !FZ, nn
    //#0xC4:
    function (gb: GameBoyCore) {
        if (!gb.FZero) {
            var temp_pc = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
            gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
            gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
            gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
            gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
            gb.programCounter = temp_pc;
            gb.CPUTicks += 12;
        }
        else {
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        }
    },
    //PUSH BC
    //#0xC5:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.registerB);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.registerC);
    },
    //ADD, n
    //#0xC6:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA + gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        gb.FHalfCarry = ((dirtySum & 0xF) < (gb.registerA & 0xF));
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //RST 0
    //#0xC7:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
        gb.programCounter = 0;
    },
    //RET FZ
    //#0xC8:
    function (gb: GameBoyCore) {
        if (gb.FZero) {
            gb.programCounter = (gb.memoryRead((gb.stackPointer + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
            gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
            gb.CPUTicks += 12;
        }
    },
    //RET
    //#0xC9:
    function (gb: GameBoyCore) {
        gb.programCounter = (gb.memoryRead((gb.stackPointer + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
        gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
    },
    //JP FZ, nn
    //#0xCA:
    function (gb: GameBoyCore) {
        if (gb.FZero) {
            gb.programCounter = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
            gb.CPUTicks += 4;
        }
        else {
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        }
    },
    //Secondary OP Code Set:
    //#0xCB:
    function (gb: GameBoyCore) {
        var opcode = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        //Increment the program counter to the next instruction:
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        //Get how many CPU cycles the current 0xCBXX op code counts for:
        gb.CPUTicks += gb.SecondaryTICKTable[opcode];
        //Execute secondary OP codes for the 0xCB OP code call.
        CBOPCODE[opcode](gb);
    },
    //CALL FZ, nn
    //#0xCC:
    function (gb: GameBoyCore) {
        if (gb.FZero) {
            var temp_pc = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
            gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
            gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
            gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
            gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
            gb.programCounter = temp_pc;
            gb.CPUTicks += 12;
        }
        else {
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        }
    },
    //CALL nn
    //#0xCD:
    function (gb: GameBoyCore) {
        var temp_pc = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
        gb.programCounter = temp_pc;
    },
    //ADC A, n
    //#0xCE:
    function (gb: GameBoyCore) {
        var tempValue = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        var dirtySum = gb.registerA + tempValue + ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) + (tempValue & 0xF) + ((gb.FCarry) ? 1 : 0) > 0xF);
        gb.FCarry = (dirtySum > 0xFF);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = false;
    },
    //RST 0x8
    //#0xCF:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
        gb.programCounter = 0x8;
    },
    //RET !FC
    //#0xD0:
    function (gb: GameBoyCore) {
        if (!gb.FCarry) {
            gb.programCounter = (gb.memoryRead((gb.stackPointer + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
            gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
            gb.CPUTicks += 12;
        }
    },
    //POP DE
    //#0xD1:
    function (gb: GameBoyCore) {
        gb.registerE = gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
        gb.registerD = gb.memoryRead((gb.stackPointer + 1) & 0xFFFF);
        gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
    },
    //JP !FC, nn
    //#0xD2:
    function (gb: GameBoyCore) {
        if (!gb.FCarry) {
            gb.programCounter = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
            gb.CPUTicks += 4;
        }
        else {
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        }
    },
    //0xD3 - Illegal
    //#0xD3:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xD3 called, pausing emulation.", 2);
        pause();
    },
    //CALL !FC, nn
    //#0xD4:
    function (gb: GameBoyCore) {
        if (!gb.FCarry) {
            var temp_pc = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
            gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
            gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
            gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
            gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
            gb.programCounter = temp_pc;
            gb.CPUTicks += 12;
        }
        else {
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        }
    },
    //PUSH DE
    //#0xD5:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.registerD);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.registerE);
    },
    //SUB A, n
    //#0xD6:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        gb.FHalfCarry = ((gb.registerA & 0xF) < (dirtySum & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //RST 0x10
    //#0xD7:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
        gb.programCounter = 0x10;
    },
    //RET FC
    //#0xD8:
    function (gb: GameBoyCore) {
        if (gb.FCarry) {
            gb.programCounter = (gb.memoryRead((gb.stackPointer + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
            gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
            gb.CPUTicks += 12;
        }
    },
    //RETI
    //#0xD9:
    function (gb: GameBoyCore) {
        gb.programCounter = (gb.memoryRead((gb.stackPointer + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
        gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
        //Immediate for HALT:
        gb.IRQEnableDelay = (gb.IRQEnableDelay == 2 || gb.memoryReader[gb.programCounter](gb, gb.programCounter) == 0x76) ? 1 : 2;
    },
    //JP FC, nn
    //#0xDA:
    function (gb: GameBoyCore) {
        if (gb.FCarry) {
            gb.programCounter = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
            gb.CPUTicks += 4;
        }
        else {
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        }
    },
    //0xDB - Illegal
    //#0xDB:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xDB called, pausing emulation.", 2);
        pause();
    },
    //CALL FC, nn
    //#0xDC:
    function (gb: GameBoyCore) {
        if (gb.FCarry) {
            var temp_pc = (gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter);
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
            gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
            gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
            gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
            gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
            gb.programCounter = temp_pc;
            gb.CPUTicks += 12;
        }
        else {
            gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
        }
    },
    //0xDD - Illegal
    //#0xDD:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xDD called, pausing emulation.", 2);
        pause();
    },
    //SBC A, n
    //#0xDE:
    function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        var dirtySum = gb.registerA - temp_var - ((gb.FCarry) ? 1 : 0);
        gb.FHalfCarry = ((gb.registerA & 0xF) - (temp_var & 0xF) - ((gb.FCarry) ? 1 : 0) < 0);
        gb.FCarry = (dirtySum < 0);
        gb.registerA = dirtySum & 0xFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = true;
    },
    //RST 0x18
    //#0xDF:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
        gb.programCounter = 0x18;
    },
    //LDH (n), A
    //#0xE0:
    function (gb: GameBoyCore) {
        gb.memoryHighWrite(gb.memoryReader[gb.programCounter](gb, gb.programCounter), gb.registerA);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //POP HL
    //#0xE1:
    function (gb: GameBoyCore) {
        gb.registersHL = (gb.memoryRead((gb.stackPointer + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
        gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
    },
    //LD (0xFF00 + C), A
    //#0xE2:
    function (gb: GameBoyCore) {
        gb.memoryHighWriter[gb.registerC](gb, gb.registerC, gb.registerA);
    },
    //0xE3 - Illegal
    //#0xE3:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xE3 called, pausing emulation.", 2);
        pause();
    },
    //0xE4 - Illegal
    //#0xE4:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xE4 called, pausing emulation.", 2);
        pause();
    },
    //PUSH HL
    //#0xE5:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.registersHL >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.registersHL & 0xFF);
    },
    //AND n
    //#0xE6:
    function (gb: GameBoyCore) {
        gb.registerA &= gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        gb.FZero = (gb.registerA == 0);
        gb.FHalfCarry = true;
        gb.FSubtract = gb.FCarry = false;
    },
    //RST 0x20
    //#0xE7:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
        gb.programCounter = 0x20;
    },
    //ADD SP, n
    //#0xE8:
    function (gb: GameBoyCore) {
        var temp_value2 = (gb.memoryReader[gb.programCounter](gb, gb.programCounter) << 24) >> 24;
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        var temp_value = (gb.stackPointer + temp_value2) & 0xFFFF;
        temp_value2 = gb.stackPointer ^ temp_value2 ^ temp_value;
        gb.stackPointer = temp_value;
        gb.FCarry = ((temp_value2 & 0x100) == 0x100);
        gb.FHalfCarry = ((temp_value2 & 0x10) == 0x10);
        gb.FZero = gb.FSubtract = false;
    },
    //JP, (HL)
    //#0xE9:
    function (gb: GameBoyCore) {
        gb.programCounter = gb.registersHL;
    },
    //LD n, A
    //#0xEA:
    function (gb: GameBoyCore) {
        gb.memoryWrite((gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter), gb.registerA);
        gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
    },
    //0xEB - Illegal
    //#0xEB:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xEB called, pausing emulation.", 2);
        pause();
    },
    //0xEC - Illegal
    //#0xEC:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xEC called, pausing emulation.", 2);
        pause();
    },
    //0xED - Illegal
    //#0xED:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xED called, pausing emulation.", 2);
        pause();
    },
    //XOR n
    //#0xEE:
    function (gb: GameBoyCore) {
        gb.registerA ^= gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        gb.FZero = (gb.registerA == 0);
        gb.FSubtract = gb.FHalfCarry = gb.FCarry = false;
    },
    //RST 0x28
    //#0xEF:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
        gb.programCounter = 0x28;
    },
    //LDH A, (n)
    //#0xF0:
    function (gb: GameBoyCore) {
        gb.registerA = gb.memoryHighRead(gb.memoryReader[gb.programCounter](gb, gb.programCounter));
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
    },
    //POP AF
    //#0xF1:
    function (gb: GameBoyCore) {
        var temp_var = gb.memoryReader[gb.stackPointer](gb, gb.stackPointer);
        gb.FZero = (temp_var > 0x7F);
        gb.FSubtract = ((temp_var & 0x40) == 0x40);
        gb.FHalfCarry = ((temp_var & 0x20) == 0x20);
        gb.FCarry = ((temp_var & 0x10) == 0x10);
        gb.registerA = gb.memoryRead((gb.stackPointer + 1) & 0xFFFF);
        gb.stackPointer = (gb.stackPointer + 2) & 0xFFFF;
    },
    //LD A, (0xFF00 + C)
    //#0xF2:
    function (gb: GameBoyCore) {
        gb.registerA = gb.memoryHighReader[gb.registerC](gb, gb.registerC);
    },
    //DI
    //#0xF3:
    function (gb: GameBoyCore) {
        gb.IME = false;
        gb.IRQEnableDelay = 0;
    },
    //0xF4 - Illegal
    //#0xF4:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xF4 called, pausing emulation.", 2);
        pause();
    },
    //PUSH AF
    //#0xF5:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.registerA);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, ((gb.FZero) ? 0x80 : 0) | ((gb.FSubtract) ? 0x40 : 0) | ((gb.FHalfCarry) ? 0x20 : 0) | ((gb.FCarry) ? 0x10 : 0));
    },
    //OR n
    //#0xF6:
    function (gb: GameBoyCore) {
        gb.registerA |= gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.FZero = (gb.registerA == 0);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        gb.FSubtract = gb.FCarry = gb.FHalfCarry = false;
    },
    //RST 0x30
    //#0xF7:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
        gb.programCounter = 0x30;
    },
    //LDHL SP, n
    //#0xF8:
    function (gb: GameBoyCore) {
        var temp_var = (gb.memoryReader[gb.programCounter](gb, gb.programCounter) << 24) >> 24;
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        gb.registersHL = (gb.stackPointer + temp_var) & 0xFFFF;
        temp_var = gb.stackPointer ^ temp_var ^ gb.registersHL;
        gb.FCarry = ((temp_var & 0x100) == 0x100);
        gb.FHalfCarry = ((temp_var & 0x10) == 0x10);
        gb.FZero = gb.FSubtract = false;
    },
    //LD SP, HL
    //#0xF9:
    function (gb: GameBoyCore) {
        gb.stackPointer = gb.registersHL;
    },
    //LD A, (nn)
    //#0xFA:
    function (gb: GameBoyCore) {
        gb.registerA = gb.memoryRead((gb.memoryRead((gb.programCounter + 1) & 0xFFFF) << 8) | gb.memoryReader[gb.programCounter](gb, gb.programCounter));
        gb.programCounter = (gb.programCounter + 2) & 0xFFFF;
    },
    //EI
    //#0xFB:
    function (gb: GameBoyCore) {
        //Immediate for HALT:
        gb.IRQEnableDelay = (gb.IRQEnableDelay == 2 || gb.memoryReader[gb.programCounter](gb, gb.programCounter) == 0x76) ? 1 : 2;
    },
    //0xFC - Illegal
    //#0xFC:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xFC called, pausing emulation.", 2);
        pause();
    },
    //0xFD - Illegal
    //#0xFD:
    function (gb: GameBoyCore) {
        cout("Illegal op code 0xFD called, pausing emulation.", 2);
        pause();
    },
    //CP n
    //#0xFE:
    function (gb: GameBoyCore) {
        var dirtySum = gb.registerA - gb.memoryReader[gb.programCounter](gb, gb.programCounter);
        gb.programCounter = (gb.programCounter + 1) & 0xFFFF;
        gb.FHalfCarry = ((dirtySum & 0xF) > (gb.registerA & 0xF));
        gb.FCarry = (dirtySum < 0);
        gb.FZero = (dirtySum == 0);
        gb.FSubtract = true;
    },
    //RST 0x38
    //#0xFF:
    function (gb: GameBoyCore) {
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter >> 8);
        gb.stackPointer = (gb.stackPointer - 1) & 0xFFFF;
        gb.memoryWriter[gb.stackPointer](gb, gb.stackPointer, gb.programCounter & 0xFF);
        gb.programCounter = 0x38;
    }
];