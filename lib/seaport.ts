'use client';

import { Seaport } from '@opensea/seaport-js';
import { ItemType } from '@opensea/seaport-js/lib/constants';
import type { CreateInputItem } from '@opensea/seaport-js/lib/types';
import type { JsonRpcSigner } from 'ethers';
import {
  NORMIES_CONTRACT,
  OPENSEA_CONDUIT,
  OPENSEA_CONDUIT_KEY,
  SEAPORT_ADDRESS,
} from './contracts';

export function createSeaportClient(signer: JsonRpcSigner): Seaport {
  return new Seaport(signer, {
    overrides: {
      contractAddress: SEAPORT_ADDRESS,
    },
    conduitKeyToConduit: {
      [OPENSEA_CONDUIT_KEY]: OPENSEA_CONDUIT,
    },
    balanceAndApprovalChecksOnOrderCreation: false,
  });
}

export async function createGiftOrder(
  seaport: Seaport,
  tokenIds: string[],
  offerer: string
) {
  const offer: CreateInputItem[] = tokenIds.map((id) => ({
    itemType: ItemType.ERC721,
    token: NORMIES_CONTRACT,
    identifier: id,
  }));

  // Subtract 120s from startTime to account for clock skew between
  // local system time and Ethereum block timestamps
  const startTime = Math.floor(Date.now() / 1000 - 120).toString();

  const { executeAllActions } = await seaport.createOrder(
    {
      offer,
      consideration: [],
      conduitKey: OPENSEA_CONDUIT_KEY,
      startTime,
    },
    offerer
  );

  return executeAllActions();
}

export async function fulfillGiftOrder(
  seaport: Seaport,
  order: Awaited<ReturnType<typeof createGiftOrder>>,
  recipient: string,
  fulfiller: string
) {
  const { executeAllActions } = await seaport.fulfillOrder({
    order,
    accountAddress: fulfiller,
    recipientAddress: recipient,
    conduitKey: OPENSEA_CONDUIT_KEY,
  });

  return executeAllActions();
}
