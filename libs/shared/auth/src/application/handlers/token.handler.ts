import { SharedTokenService } from '@erp-system/shared-token';
import { JwtPayload } from '@erp-system/shared-types';
import { InternalServerErrorException, LoggerService } from '@nestjs/common';

export async function generateTokens(
    tokenService: SharedTokenService,
    logger: LoggerService,
    payload: JwtPayload
) {
    let accessToken: string;
    let refreshToken: string;

    try {
        accessToken = await tokenService.generateAccessToken(payload);
        refreshToken = await tokenService.generateRefreshToken(payload);
        
    } catch (error) {
        logger.error(`Error generating JWT token\n${error}`);
        throw new InternalServerErrorException();
    }
    
    return { tenantId: payload.orgId, accessToken, refreshToken };
}
