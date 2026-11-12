const projectsData = [
    {
        title: "CFP Projector",
        link: "https://cfpp.netlify.app",
        img: "cfp.png",
        bg: "#111",
        type: "CFB Analytics",
        rate: 10,
        cta: 'Open Tool',
        description: `CFP Projector is an advanced sports analytics platform powered by a custom Monte Carlo simulation engine that evaluates and forecasts NCAA College Football Playoff outcomes. Featuring an interactive scenario editor, the tool enables users to simulate future match-ups, adjust spread margins, and instantly analyze how results ripple through conference standings and committee rankings.`
    },
    {
        title: "Fishtail",
        link: "docs/FishtailRules.pdf",
        img: "fishtail.png",
        type: "Board Game",
        bg: "#0086c0",
        rate: 9,
        buy: "https://buy.stripe.com/8x2cN44QZelEcygf1S2cg02",
        cta: 'View Rules',
        description: `Fishtail is an original tactical card and resource-management game where players compete as anglers to control prime fishing spots, shape shared bait conditions in the Tackle Box, and secure valuable catches. Combining boat placement with dice manipulation, the game delivers quick, deep decision-making suitable for both casual game nights and seasoned tabletop enthusiasts.`
    },
    {
        title: "GIBBS",
        link: "https://gibbpro.com",
        img: "gibbs.png",
        type: "NFL Pick'em",
        bg: "#111",
        rate: 5,
description: `GIBBS is an NFL Pick'em web application with a strategic twist: players earn bonus points for correctly picking the underdog. Built with a clean interface, the platform pairs real-time scoring and live league standings with risk-reward decision-making that keeps it competitive all season long.`    },
    {
        title: "NHS",
        link: "https://nationalhomeschoolsoccer.com",
        img: "nhs.png",
        type: "Homeschool Soccer",
        bg: "#002244",
        rate: 5,
        description: `National Homeschool Soccer (NHS) is the official web portal serving national homeschool soccer tournaments, team directory, and season schedules across the United States.`
    },
    {
        title: "Feed Yer Mama",
        link: "docs/fymrules.html",
        img: "fym.png",
        type: "Board Game",
        bg: "#530D00",
        buy: "https://buy.stripe.com/6oU00i97f2CW7dWdXO2cg03",
        cta: 'View Rules',
        rate: 5,
        description: `Feed ’Yer Mama is a fast-paced engine-building strategy card game for 2-5 players about raising animals, growing plants, and racing to feed Mama. Featuring interactive farm management and mischievous animal sabotage, the game scales dynamically with group size and offers optional advanced rules like a face-up Market and Roll to Shop modes.`
    },
    {
        title: "Go Bee",
        link: "https://gobeegame.netlify.app",
        img: "gobee.png",
        type: "Online Game",
        bg: "#ffce31",
        rate: 4,
        cta: 'Play Now',
        description: `Go Bee is a sharp, fast-paced online abstract strategy game for 2 players about outmaneuvering your rival, controlling the hive, and racing to outsmart the board. It plays out as a tight, perfect-information duel with zero luck, with a twist: the movement cards you use to make your plays cycle directly into your opponent's hands.`
    },
    /*
    {
        title: "Monkey vs Wizard",
        link: "https://bennyalashari.com/monkey-vs-wizard",
        img: "mvw.png",
        type: "Card Game",
        bg: "#B7DFD6",
        rate: 2
    },
    {
        title: "eFilmHub",
        link: "https://efilmhub.com",
        img: "efilmhub.png",
        bg: "#111",
        type: "Website",
        rate: 4
    },
    {
        title: "TOC",
        link: "https://gtcalendar.netlify.app/",
        img: "toc.png",
        type: "Business Tool",
        bg: '#e8858e',
        rate: 1
    },
    {
        title: "Monopoly Deal 2.0",
        link: "https://www.figma.com/proto/871TgdQwlCIZYlK55SPeJ9/Monopoly-Deal?node-id=2041-15&t=tSNA024F4CH4z4G9-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1",
        img: "deal.png",
        bg: "#30A9F4",
        type: "Game Expansion",
        rate: 1
    },
    {
        title: "Quacks Expansion",
        link: "https://www.figma.com/proto/DyYgqacTc98MCKyJYn7Ilh/Quacks?node-id=178-3170&p=f&t=OWwGslT5gE4rEwOD-0&scaling=contain&content-scaling=fixed&page-id=136%3A2&starting-point-node-id=178%3A3170",
        img: "quacks.png",
        bg: '#77b4e1',
        type: "game Expansion",
        rate: 1
    },
    {
        title: "TM Expansion",
        link: "https://www.figma.com/proto/1GKqmMiojkRJZst76ngA34/TM?node-id=3549-48&t=N9JLzGZJ1iOLlwe1-0&scaling=contain&content-scaling=fixed&page-id=3549%3A17",
        img: "tm.png",
        bg: "#b25100",
        type: "game Expansion",
        rate: 1
    },
    {
        title: "The PUZZ",
        link: "https://puzzles.bennyalashari.com",
        img: "puzz.png",
        type: "website",
        bg: "#666",
        rate: 4
    },
    {
        title: "Pool Deck",
        link: "https://www.figma.com/design/15elxOYqEOW6OAPFv52CzJ/ports-logo?node-id=2038-2&p=f&t=uzMCTpl3RFQMg6r4-0",
        img: "pool.png",
        type: "Game",
        rate: 1
    },
    {
        title: "Gold Dust & Outlaws",
        link: "https://www.figma.com/design/vezMvObtWMZTnppp1srLoU/Gold-Dust---Outlaws?node-id=2086-362&t=l5FNwWEt25qL8mh3-0",
        img: "gdo.png",
        type: "Card Game",
        rate: 1
    },
    {
        title: "Aalsmeer",
        link: "https://www.figma.com/design/aUBYAmwWjm8P6ze8zVqD3H/Aalsmeer?node-id=105-13&t=OIR41rIG5BUv86eB-0",
        img: "aalsmeer.png",
        type: "Card Game",
        rate: 1
    },
    {
        title: "Zoorok",
        link: "https://www.figma.com/design/QyJ1jZWeHn40guIohHubcX/Nurok?node-id=2020-1432&t=uzMCTpl3RFQMg6r4-0",
        img: "zr2.png",
        bg: '#64ACBD',
        type: "Card Game",
        rate: 1
    },
    {
        title: "Santorini Expansion",
        link: "https://www.figma.com/design/DfiwAwhm06TrYfBwbaMRFP/Santorini?node-id=0-1&p=f&t=zRDdFx47Q2VRb9hf-0",
        img: "sx.png",
        bg: "#7cbbdc",
        type: "game Expansion",
        rate: 1
    },
    {
        title: "Square Feats",
        link: "https://www.figma.com/design/eosucBmSjLwdxaupgrzPZo/Square-Feats?m=auto&t=4qCBAzMOAV5CCNg0-6",
        img: "sf.png",
        bg: "#D3B45D",
        type: "In Progress",
        rate: 1
    },
    {
        title: "Nutrispark",
        link: "https://nutrispark.netlify.app/",
        img: "ns.png",
        bg:"#d6eeb8",
        type: "website",
        rate: 4
    },
    {
        title: "Tribes",
        link: "https://www.figma.com/design/QyJ1jZWeHn40guIohHubcX/Nurok?node-id=2084-50&t=6G4of2zIrsNyvhC5-0",
        img: "tribes.png",
        bg: "#AE451B",
        type: "In Progress",
        rate: 1
    }*/
];