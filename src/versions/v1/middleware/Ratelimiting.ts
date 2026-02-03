import rateLimit from "express-rate-limit";

export function ratelimitRequests(
    windowMs: Number = 15 * 60 * 1000,
    max: Number = 100
) {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: {
            error: "For mange anmodninger fra denne IP, prøv igen senere."
        },
        standardHeaders: true,
        ipv6Subnet: 64
    })
}