
CREATE TABLE [dbo].[User]
(
    [Id] BIGINT IDENTITY (1, 1) NOT NULL,
    [Email] VARCHAR (512) NOT NULL,
    [Password] VARBINARY (8000) NOT NULL,
    [Salt] VARBINARY (8000) NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_User] UNIQUE NONCLUSTERED ([Email] ASC)
);

GO

CREATE TABLE [dbo].[Flow]
(
    [Id] BIGINT IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR (255) NOT NULL,
    [Data] NVARCHAR (MAX) NOT NULL,
    [UserId] BIGINT NULL,
    CONSTRAINT [PK_Flow] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Flow_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id])
);

GO

CREATE TABLE [dbo].[Function]
(
    [Id] BIGINT IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR (255) NOT NULL,
    [Description] NVARCHAR (MAX) NOT NULL,
    [DeltaX] FLOAT NOT NULL,
    [IsNeedMaxLoadFactor] BIT NOT NULL
);

GO
SET IDENTITY_INSERT [dbo].[Function] ON
INSERT INTO [dbo].[Function]
    ([Id],[Name],[Description],[DeltaX],[IsNeedMaxLoadFactor])
VALUES
    (1, N'Входной поток', N'', 1, 0),
    (2, N'A(i)', N'', 1, 0),
    (3, N'mA(ρ)', N'', 0.05, 1),
    (4, N'dispA(ρ)', N'', 0.05, 1),
    (5, N'q(t)', N'', 1, 0),
    (6, N'mq(ρ)', N'', 0.05, 1),
    (7, N'dispq(ρ)', N'', 0.05, 1),
    (8, N'P(i)', N'', 1, 0),
    (9, N'P0(i)', N'', 1, 0),
    (10, N'V(t)', N'', 1, 0),
    (11, N'E(t)', N'', 1, 0),
    (12, N'mE(ρ)', N'', 0.05, 1),
    (13, N'aE(ρ)=α(ρ-p₀)²+β(ρ-p₀)', N'', 0.05, 1),
    (14, N'σ(ρ)', N'', 0.05, 1),
    (15, N'ν(ρ)=dq(ρ)/mq(p)', N'', 0.05, 1),
    (16, N'p(q)=aq+b√q+p₀', N'', 0.05, 1),
    (17, N'KI(i)', N'', 1, 0),
    (18, N'PKI(i)', N'', 1, 0),
    (19, N'M(i)', N'', 1, 0),
    (20, N'I(i)', N'', 1, 0),
    (21, N'mν(ρ)', N'', 0.05, 1),
    (22, N'Pν(ρ)', N'', 0.05, 1),
    (23, N'σ(ρ)/ρ', N'', 0.05, 1),
    (24, N'amq(ρ)=α(ρ-p₀)+β(ρ-p₀)²', N'', 0.05, 1)

SET IDENTITY_INSERT [dbo].[Function] OFF



















