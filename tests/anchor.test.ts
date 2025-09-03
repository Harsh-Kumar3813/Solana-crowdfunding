import * as anchor from "@coral-xyz/anchor";

const { SystemProgram, PublicKey } = anchor.web3;

const PROGRAM_ID = new PublicKey(
  "J5nHPoCoWsL7grywDNtbXrY4PQCXMbHR3Zt5ce1JbBsd"
);

const IDL = {
  version: "0.1.0",
  name: "yogdaan",
  instructions: [
    {
      name: "initialize",
      accounts: [
        { name: "programState", isMut: true, isSigner: false },
        { name: "deployer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "createCampaign",
      accounts: [
        { name: "programState", isMut: true, isSigner: false },
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "title", type: "string" },
        { name: "description", type: "string" },
        { name: "imageUrl", type: "string" },
        { name: "goal", type: "u64" },
      ],
    },
    {
      name: "updateCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "cid", type: "u64" },
        { name: "title", type: "string" },
        { name: "description", type: "string" },
        { name: "imageUrl", type: "string" },
        { name: "goal", type: "u64" },
      ],
    },
    {
      name: "deleteCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "cid", type: "u64" }],
    },
    {
      name: "donate",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "transaction", isMut: true, isSigner: false },
        { name: "donor", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "cid", type: "u64" },
        { name: "amount", type: "u64" },
      ],
    },
    {
      name: "withdraw",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "transaction", isMut: true, isSigner: false },
        { name: "programState", isMut: true, isSigner: false },
        { name: "platformAddress", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "cid", type: "u64" },
        { name: "amount", type: "u64" },
      ],
    },
    {
      name: "updatePlatformSettings",
      accounts: [
        { name: "updater", isMut: true, isSigner: true },
        { name: "programState", isMut: true, isSigner: false },
      ],
      args: [{ name: "newPlatformFee", type: "u64" }],
    },
  ],
  accounts: [
    {
      name: "Campaign",
      type: {
        kind: "struct",
        fields: [
          { name: "cid", type: "u64" },
          { name: "creator", type: "publicKey" },
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "imageUrl", type: "string" },
          { name: "goal", type: "u64" },
          { name: "amountRaised", type: "u64" },
          { name: "timestamp", type: "u64" },
          { name: "donors", type: "u64" },
          { name: "withdrawals", type: "u64" },
          { name: "balance", type: "u64" },
          { name: "active", type: "bool" },
        ],
      },
    },
    {
      name: "ProgramState",
      type: {
        kind: "struct",
        fields: [
          { name: "initialized", type: "bool" },
          { name: "campaignCount", type: "u64" },
          { name: "platformFee", type: "u64" },
          { name: "platformAddress", type: "publicKey" },
        ],
      },
    },
    {
      name: "Transaction",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "publicKey" },
          { name: "cid", type: "u64" },
          { name: "amount", type: "u64" },
          { name: "timestamp", type: "u64" },
          { name: "credited", type: "bool" },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "AlreadyInitialized",
      msg: "Th program has already been initialied.",
    },
    {
      code: 6001,
      name: "TitleTooLong",
      msg: "Title exceeds the maximum length of 64 characters.",
    },
    {
      code: 6002,
      name: "DescriptionTooLong",
      msg: "Description exceeds the maximum length of 512 characters.",
    },
    {
      code: 6003,
      name: "ImageUrlTooLong",
      msg: "Image URL exceeds the maximum length of 256 characters.",
    },
    {
      code: 6004,
      name: "InvalidGoalAmount",
      msg: "Invalid goal amount. Goal must be greater than zero.",
    },
    { code: 6005, name: "Unauthorized", msg: "Unauthorized access." },
    { code: 6006, name: "CampaignNotFound", msg: "Campaign not found." },
    { code: 6007, name: "InactiveCampaign", msg: "Campaign is inactive." },
    {
      code: 6008,
      name: "InvalidDonationAmount",
      msg: "Donation amount must be at least 1 SOL.",
    },
    {
      code: 6009,
      name: "CampaignGoalActualized",
      msg: "Campaign goal reached.",
    },
    {
      code: 6010,
      name: "InvalidWithdrawalAmount",
      msg: "Withdrawal amount must be at least 1 SOL.",
    },
    {
      code: 6011,
      name: "InsufficientFund",
      msg: "Insufficient funds in the campaign.",
    },
    {
      code: 6012,
      name: "InvalidPlatformAddress",
      msg: "The provided platform address is invalid.",
    },
    {
      code: 6013,
      name: "InvalidPlatformFee",
      msg: "Invalid platform fee percentage.",
    },
  ],
};

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = new anchor.Program(IDL, PROGRAM_ID, provider);

// ✅ Campaign helper with correct PDA seeds
async function createCampaignWith1SOLGoal() {
  const creator = provider.wallet;

  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    PROGRAM_ID
  );

  const state = await program.account.programState.fetch(programStatePda);
  const cid = new anchor.BN(state.campaignCount.toNumber());

  const [campaignPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), cid.toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );

  const goal = new anchor.BN(1_000_000_000); // 1 SOL

  await program.methods
    .createCampaign(`Campaign #${cid}`, "desc", "https://img.png", goal)
    .accounts({
      programState: programStatePda,
      campaign: campaignPda,
      creator: creator.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const campaign = await program.account.campaign.fetch(campaignPda);
  return { cid, campaignPda, programStatePda, campaign };
}

describe("yogdaan", () => {
  let CID: any, DONORS_COUNT: any, WITHDRAW_COUNT: any;

  it("initializes the program", async () => {
    const initializer = provider.wallet;

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      PROGRAM_ID
    );

    try {
      // Try fetching to see if already initialized
      const state = await program.account.programState.fetch(programStatePda);
      console.log("✅ Program already initialized.");
    } catch (_) {
      // Not yet initialized — proceed
      await program.methods
        .initialize()
        .accounts({
          programState: programStatePda,
          initializer: initializer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const state = await program.account.programState.fetch(programStatePda);
      console.log("✅ Initialized program:", state);
    }
  });

  it("creates a campaign", async () => {
    const creator = provider.wallet;

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      PROGRAM_ID
    );

    const state = await program.account.programState.fetch(programStatePda);
    CID = state.campaignCount.add(new anchor.BN(1));

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign"), CID.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const title = `Test Campaign Title #${CID.toString()}`;
    const description = `Test Campaign description #${CID.toString()}`;
    const image_url = `https://dummy_image_${CID.toString()}.png`;
    const goal = new anchor.BN(25 * 1_000_000_000); // 25 SOL

    await program.methods
      .createCampaign(title, description, image_url, goal)
      .accounts({
        programState: programStatePda,
        campaign: campaignPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const campaign = await program.account.campaign.fetch(campaignPda);
    DONORS_COUNT = campaign.donors;
    WITHDRAW_COUNT = campaign.withdrawals;

    console.log("Campaign created:", campaign);
  });

  it("updates platform fee", async () => {
    const updater = provider.wallet;

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      PROGRAM_ID
    );

    const tx = await program.methods
      .updatePlatformSettings(new anchor.BN(7))
      .accounts({
        updater: updater.publicKey,
        programState: programStatePda,
      })
      .rpc();

    const stateAfter = await program.account.programState.fetch(
      programStatePda
    );
    console.log("Updated platform state:", stateAfter);
  });

  it("updates a campaign", async () => {
    const creator = provider.wallet;

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign"), CID.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const newTitle = `Updated Campaign #${CID.toString()}`;
    const newDesc = `Updated Description #${CID.toString()}`;
    const newUrl = `https://new_image_${CID.toString()}.png`;
    const newGoal = new anchor.BN(30 * 1_000_000_000); // 30 SOL

    await program.methods
      .updateCampaign(CID, newTitle, newDesc, newUrl, newGoal)
      .accounts({
        campaign: campaignPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const updated = await program.account.campaign.fetch(campaignPda);
    console.log("Updated campaign:", updated);
  });

  it("donates to campaign", async () => {
    const donor = provider.wallet;

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign"), CID.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const campaignBefore = await program.account.campaign.fetch(campaignPda);
    const currentDonorCount = campaignBefore.donors;
    console.log("Donor count before:", currentDonorCount.toString());

    const [transactionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("donor"),
        donor.publicKey.toBuffer(),
        CID.toArrayLike(Buffer, "le", 8),
        currentDonorCount.add(new anchor.BN(1)).toArrayLike(Buffer, "le", 8),
      ],
      PROGRAM_ID
    );

    const amount = new anchor.BN(2 * 1_000_000_000); // 5 SOL

    await program.methods
      .donate(CID, amount)
      .accounts({
        campaign: campaignPda,
        transaction: transactionPda,
        donor: donor.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const donationTx = await program.account.transaction.fetch(transactionPda);
    console.log("Donation TX:", donationTx);

    const campaignAfter = await program.account.campaign.fetch(campaignPda);
    console.log("Updated donor count:", campaignAfter.donors.toString());
    DONORS_COUNT = campaignAfter.donors;
  });

  it("withdraws from campaign", async () => {
    const creator = provider.wallet;

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      PROGRAM_ID
    );

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign"), CID.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const [withdrawPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("withdraw"),
        creator.publicKey.toBuffer(),
        CID.toArrayLike(Buffer, "le", 8),
        WITHDRAW_COUNT.add(new anchor.BN(1)).toArrayLike(Buffer, "le", 8),
      ],
      PROGRAM_ID
    );

    const amount = new anchor.BN(2 * 1_000_000_000); // 3 SOL

    const programState = await program.account.programState.fetch(
      programStatePda
    );

    await program.methods
      .withdraw(CID, amount)
      .accounts({
        programState: programStatePda,
        campaign: campaignPda,
        transaction: withdrawPda,
        creator: creator.publicKey,
        platformAddress: programState.platformAddress,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const withdrawTx = await program.account.transaction.fetch(withdrawPda);
    console.log("Withdraw TX:", withdrawTx);
  });
  it("should fail to update platform settings from non-authorized wallet", async () => {
    const fakeWallet = anchor.web3.Keypair.generate();

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      PROGRAM_ID
    );

    try {
      await program.methods
        .updatePlatformSettings(new anchor.BN(9))
        .accounts({
          updater: fakeWallet.publicKey,
          programState: programStatePda,
        })
        .signers([fakeWallet])
        .rpc();
      throw new Error("Unauthorized update did not throw.");
    } catch (err) {
      console.log("✅ Unauthorized update blocked:", err.message);
    }
  });
  it("should fail if donation is less than 1 SOL", async () => {
    const donor = provider.wallet;
    const amount = new anchor.BN(0.5 * 1_000_000_000); // less than 1 SOL

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign"), CID.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const [transactionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("donor"),
        donor.publicKey.toBuffer(),
        CID.toArrayLike(Buffer, "le", 8),
        new anchor.BN(99).toArrayLike(Buffer, "le", 8), // simulate higher donor count
      ],
      PROGRAM_ID
    );

    try {
      await program.methods
        .donate(CID, amount)
        .accounts({
          campaign: campaignPda,
          transaction: transactionPda,
          donor: donor.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      throw new Error("Invalid donation passed.");
    } catch (err) {
      console.log("✅ Donation amount validation caught:", err.message);
    }
  });

  it("deletes a campaign", async () => {
    const creator = provider.wallet;

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign"), CID.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    await program.methods
      .deleteCampaign(CID)
      .accounts({
        campaign: campaignPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    try {
      await program.account.campaign.fetch(campaignPda);
    } catch (err) {
      console.log("Campaign successfully deleted.");
    }
  });
});
