
CREATE TABLE [dbo].[User] (
    [Id]       BIGINT           IDENTITY (1, 1) NOT NULL,
    [Email]    VARCHAR (512)    NOT NULL,
    [Password] VARBINARY (8000) NOT NULL,
    [Salt]     VARBINARY (8000) NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_User] UNIQUE NONCLUSTERED ([Email] ASC)
);

GO

CREATE TABLE [dbo].[Flow] ( 
    [Id] BIGINT IDENTITY (1, 1) NOT NULL, 
    [Name] NVARCHAR (255) NOT NULL, 
    [Data] NVARCHAR (MAX) NOT NULL, 
    [UserId] BIGINT NULL, 
    CONSTRAINT [PK_Flow] PRIMARY KEY CLUSTERED ([Id] ASC), 
    CONSTRAINT [FK_Flow_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) 
);

GO

CREATE TABLE [dbo].[Function] ( 
    [Id] BIGINT IDENTITY (1, 1) NOT NULL, 
    [Name] NVARCHAR (255) NOT NULL, 
    [Description] NVARCHAR (MAX) NOT NULL
);

GO
SET IDENTITY_INSERT [dbo].[Function] ON
INSERT INTO [dbo].[Function] ([Id],[Name],[Description]) VALUES 
(1,N'Входной поток',N''),
(2,N'A(i)',N''),
(3,N'mA(ρ)',N''),
(4,N'dispA(ρ)',N''),
(5,N'q(t)',N''),
(6,N'mq(ρ)',N''),
(7,N'dispq(ρ)',N''),
(8,N'P(i)',N''),
(9,N'P0(i)',N''),
(10,N'V(t)',N''),
(11,N'E(t)',N''),
(12,N'mE(ρ)',N''),
(13,N'F(ρ)=mE(ρ)/ρ',N''),
(14,N'F(ρ)=α+βρ',N''),
(15,N'F(ρ)=αρ+βρ²',N''),
(16,N'F(ρ)=(αρ+βρ²)/2(1-ρ)',N''),
(17,N'KI(i)',N''),
(18,N'PKI(i)',N''),
(19,N'M(i)',N''),
(20,N'I(i)',N''),
(21,N'mp',N'')
SET IDENTITY_INSERT [dbo].[Function] OFF



















